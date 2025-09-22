// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@nomicfoundation/hardhat-toolbox/contracts/token/ERC1155/ERC1155.sol";
import "@nomicfoundation/hardhat-toolbox/contracts/access/Ownable.sol";
import "@nomicfoundation/hardhat-toolbox/contracts/utils/Strings.sol";

contract BlueCarbon is ERC1155, Ownable {
    using Strings for uint256;

    struct Project {
        uint256 projectId;
        string name;
        string location;
        uint256 totalCredits;
        uint256 price; // Price in Wei for one credit
        bool exists;
    }

    mapping(uint256 => Project) public projects;
    uint256 public nextProjectId;

    event ProjectCreated(
        uint256 indexed projectId,
        string name,
        string location,
        uint256 totalCredits,
        uint256 price
    );

    event CreditsPurchased(
        address indexed buyer,
        uint256 indexed projectId,
        uint256 amount,
        uint256 cost
    );

    constructor(address initialOwner) ERC1155("") Ownable(initialOwner) {
        nextProjectId = 1;
    }

    function uri(uint256 _id) public view override returns (string memory) {
        return string(abi.encodePacked("https://your-metadata-api.com/api/token/", _id.toString()));
    }

    function createProject(
        string memory _name,
        string memory _location,
        uint256 _totalCredits,
        uint256 _price
    ) public onlyOwner {
        uint256 projectId = nextProjectId;
        projects[projectId] = Project({
            projectId: projectId,
            name: _name,
            location: _location,
            totalCredits: _totalCredits,
            price: _price,
            exists: true
        });

        // Mint the credits to the contract owner (or a specific project wallet)
        _mint(owner(), projectId, _totalCredits, "");

        emit ProjectCreated(projectId, _name, _location, _totalCredits, _price);
        nextProjectId++;
    }

    function purchaseCredits(uint256 _projectId, uint256 _amount) public payable {
        require(projects[_projectId].exists, "Project does not exist");
        require(_amount > 0, "Amount must be greater than zero");

        Project storage project = projects[_projectId];
        uint256 availableCredits = balanceOf(owner(), _projectId);
        require(availableCredits >= _amount, "Not enough credits available for sale");

        uint256 totalCost = project.price * _amount;
        require(msg.value == totalCost, "Incorrect payment amount");

        // Transfer credits from owner to the buyer
        safeTransferFrom(owner(), msg.sender, _projectId, _amount, "");

        emit CreditsPurchased(msg.sender, _projectId, _amount, msg.value);
    }
    
    function withdraw() public onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }

    // This function allows the owner to update the price of a project
    function updateProjectPrice(uint256 _projectId, uint256 _newPrice) public onlyOwner {
        require(projects[_projectId].exists, "Project does not exist");
        projects[_projectId].price = _newPrice;
    }
}
