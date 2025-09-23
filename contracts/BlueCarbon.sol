// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BlueCarbon is ERC1155, Ownable {
    struct Project {
        uint256 projectId;
        string name;
        string location;
        uint256 totalCredits;
        uint256 price; // Price in Wei per credit
        bool exists;
    }

    uint256 public nextProjectId;
    mapping(uint256 => Project) public projects;

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
        nextProjectId = 1; // Start project IDs from 1
    }

    function createProject(
        string memory _name,
        string memory _location,
        uint256 _totalCredits,
        uint256 _price // in Wei
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

        _mint(owner(), projectId, _totalCredits, "");

        emit ProjectCreated(projectId, _name, _location, _totalCredits, _price);
        nextProjectId++;
    }

    function purchaseCredits(uint256 _projectId, uint256 _amount) public payable {
        Project storage project = projects[_projectId];
        require(project.exists, "Project does not exist");
        require(_amount > 0, "Amount must be greater than zero");

        uint256 totalCost = project.price * _amount;
        require(msg.value == totalCost, "Incorrect Ether sent");

        safeTransferFrom(owner(), msg.sender, _projectId, _amount, "");

        emit CreditsPurchased(msg.sender, _projectId, _amount, totalCost);
    }
    
    function updateProjectPrice(uint256 _projectId, uint256 _newPrice) public onlyOwner {
        require(projects[_projectId].exists, "Project does not exist");
        projects[_projectId].price = _newPrice;
    }

    function withdraw() public onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }

    // The following functions are overrides required by Solidity.

    function uri(uint256 _id) public view override returns (string memory) {
        // In a real implementation, you might return a URI pointing to project metadata
        return "";
    }
}
