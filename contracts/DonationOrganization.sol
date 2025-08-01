// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DonationOrganization {
    enum Role { None, SuperAdmin, Admin, Approver }
    enum ProposalStatus { Pending, Approved, Rejected, Executed }

    struct Organization {
        string name;
        string purpose;
        uint8 approvalThreshold;
        address superAdmin;
        address[] approvers;
        mapping(address => Role) roles;
        bool exists;
    }

    struct Proposal {
        uint256 id;
        address proposer;
        address recipient;
        uint256 amount;
        string currency;
        string description;
        string category;
        string fileUrl;
        uint256 approvals;
        uint256 rejections;
        ProposalStatus status;
        mapping(address => bool) voted;
    }

    mapping(uint256 => Organization) public organizations;
    mapping(uint256 => mapping(uint256 => Proposal)) public proposals;
    mapping(uint256 => uint256) public orgProposalCounter;

    uint256 public orgCounter;

    event OrganizationCreated(uint256 orgId, string name, address superAdmin);
    event ApproverAdded(uint256 orgId, address approver);
    event ProposalCreated(uint256 orgId, uint256 proposalId, address proposer);
    event ProposalApproved(uint256 orgId, uint256 proposalId, address approver);
    event ProposalRejected(uint256 orgId, uint256 proposalId, address approver);
    event ProposalExecuted(uint256 orgId, uint256 proposalId);

    modifier onlySuperAdmin(uint256 orgId) {
        require(organizations[orgId].roles[msg.sender] == Role.SuperAdmin, "Not super admin");
        _;
    }

    modifier onlyAdminOrSuper(uint256 orgId) {
        Role role = organizations[orgId].roles[msg.sender];
        require(role == Role.SuperAdmin || role == Role.Admin, "Not authorized");
        _;
    }

    modifier onlyApprover(uint256 orgId) {
        require(organizations[orgId].roles[msg.sender] == Role.Approver, "Not approver");
        _;
    }

    function createOrganization(string memory name, string memory purpose, uint8 threshold, address[] memory approvers) external {
        require(threshold >= 2 && threshold <= 5, "Invalid threshold");
        require(approvers.length >= 2, "At least 2 approvers required");

        orgCounter++;
        uint256 orgId = orgCounter;

        Organization storage org = organizations[orgId];
        org.name = name;
        org.purpose = purpose;
        org.approvalThreshold = threshold;
        org.superAdmin = msg.sender;
        org.exists = true;

        org.roles[msg.sender] = Role.SuperAdmin;

        for (uint i = 0; i < approvers.length; i++) {
            org.approvers.push(approvers[i]);
            org.roles[approvers[i]] = Role.Approver;
        }

        emit OrganizationCreated(orgId, name, msg.sender);
    }

    function addApprover(uint256 orgId, address newApprover) external onlyAdminOrSuper(orgId) {
        Organization storage org = organizations[orgId];
        require(org.roles[newApprover] == Role.None, "Already added");

        org.roles[newApprover] = Role.Approver;
        org.approvers.push(newApprover);

        emit ApproverAdded(orgId, newApprover);
    }

    function createProposal(
        uint256 orgId,
        address recipient,
        uint256 amount,
        string memory currency,
        string memory description,
        string memory category,
        string memory fileUrl
    ) external onlyApprover(orgId) {
        uint256 propId = ++orgProposalCounter[orgId];

        Proposal storage prop = proposals[orgId][propId];
        prop.id = propId;
        prop.proposer = msg.sender;
        prop.recipient = recipient;
        prop.amount = amount;
        prop.currency = currency;
        prop.description = description;
        prop.category = category;
        prop.fileUrl = fileUrl;
        prop.status = ProposalStatus.Pending;

        emit ProposalCreated(orgId, propId, msg.sender);
    }

    function approveProposal(uint256 orgId, uint256 proposalId) external onlyApprover(orgId) {
        Proposal storage prop = proposals[orgId][proposalId];
        require(prop.status == ProposalStatus.Pending, "Not pending");
        require(!prop.voted[msg.sender], "Already voted");

        prop.voted[msg.sender] = true;
        prop.approvals++;

        emit ProposalApproved(orgId, proposalId, msg.sender);

        if (prop.approvals >= organizations[orgId].approvalThreshold) {
            prop.status = ProposalStatus.Approved;
            // TODO: Integrasi transfer token di sini
            prop.status = ProposalStatus.Executed;
            emit ProposalExecuted(orgId, proposalId);
        }
    }

    function rejectProposal(uint256 orgId, uint256 proposalId) external onlyApprover(orgId) {
        Proposal storage prop = proposals[orgId][proposalId];
        require(prop.status == ProposalStatus.Pending, "Not pending");
        require(!prop.voted[msg.sender], "Already voted");

        prop.voted[msg.sender] = true;
        prop.rejections++;

        emit ProposalRejected(orgId, proposalId, msg.sender);

        if (prop.rejections > organizations[orgId].approvers.length / 2) {
            prop.status = ProposalStatus.Rejected;
        }
    }

    function getApprovers(uint256 orgId) external view returns (address[] memory) {
        return organizations[orgId].approvers;
    }
}