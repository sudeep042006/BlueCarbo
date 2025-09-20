// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@nomicfoundation/hardhat-toolbox/contracts/token/ERC1155/ERC1155.sol";
import "@nomicfoundation/hardhat-toolbox/contracts/access/Ownable.sol";
import "@nomicfoundation/hardhat-toolbox/contracts/utils/Strings.sol";

contract BlueCarbon is ERC1155, Ownable {
    uint256 public nextProjectId;

    struct Project {
        string name;
        string location;
        address ngo;
        uint256 totalCredits;
        uint256 price; // Price per credit in wei
        bool exists;
    }

    mapping(uint256 => Project) public projects;

    event ProjectCreated(
        uint256 indexed projectId,
        string name,
        string location,
        address indexed ngo,
        uint256 totalCredits,
        uint256 price
    );

    event CreditsPurchased(
        uint256 indexed projectId,
        address indexed buyer,
        uint256 amount,
        uint256 cost
    );

    constructor(address initialOwner) ERC1155("Blue Carbon Credits") Ownable(initialOwner) {}

    function createProject(
        string memory _name,
        string memory _location,
        uint256 _totalCredits,
        uint256 _price
    ) public {
        uint256 projectId = nextProjectId;
        projects[projectId] = Project({
            name: _name,
            location: _location,
            ngo: msg.sender,
            totalCredits: _totalCredits,
            price: _price,
            exists: true
        });

        // Mint the total supply of credits for this project to the NGO
        _mint(msg.sender, projectId, _totalCredits, "");

        emit ProjectCreated(
            projectId,
            _name,
            _location,
            msg.sender,
            _totalCredits,
            _price
        );

        nextProjectId++;
    }

    function purchaseCredits(uint256 _projectId, uint256 _amount) public payable {
        Project storage project = projects[_projectId];
        require(project.exists, "Project does not exist");
        
        uint256 cost = project.price * _amount;
        require(msg.value == cost, "Incorrect payment amount");

        // Check if NGO has enough credits to sell
        require(balanceOf(project.ngo, _projectId) >= _amount, "Not enough credits available for sale");
        
        // Transfer credits from NGO to buyer
        safeTransferFrom(project.ngo, msg.sender, _projectId, _amount, "");

        // Transfer funds to the NGO
        (bool success, ) = project.ngo.call{value: msg.value}("");
        require(success, "Failed to send payment to NGO");

        emit CreditsPurchased(
            _projectId,
            msg.sender,
            _amount,
            cost
        );
    }
    
    // The following functions are overrides required by Solidity.

    function uri(uint256 _id) public view override returns (string memory) {
        require(projects[_id].exists, "Project does not exist");
        return string(abi.encodePacked("api/project/", Strings.toString(_id)));
    }
}
