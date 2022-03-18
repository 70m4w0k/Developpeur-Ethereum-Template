// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

contract Lycee {
    struct StudentGrades {
        uint biology;
        uint maths;
        uint french;
    }
    // class => addr => course
    mapping(string => mapping(address => string)) public professors;

    mapping(string => StudentGrades[]) public students;

    constructor() {
        professors["2a"][0x5B38Da6a701c568545dCfcB03FcB875f56beddC4] = "biology";
        professors["2a"][0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2] = "maths";
        professors["2a"][0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db] = "french";
        professors["2b"][0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB] = "biology";
        professors["2b"][0x617F2E2fD72FD9D5503197092aC168c91465E7f2] = "maths";
        professors["2b"][0x17F6AD8Ef982297579C203069C1DbfFE4348c372] = "french";
    }

    function addGrade(string memory _class, uint _biology, uint _maths, uint _french) public {
        StudentGrades memory grades = StudentGrades(_biology, _maths, _french);
        students[_class].push(grades);
    }

    function setGrade(string memory _class, uint _studentId, string memory _course, uint _grade) public {
        require(keccak256(abi.encodePacked(professors[_class][msg.sender])) == keccak256(abi.encodePacked(_course)), "You are not the right professor");
        if (keccak256(abi.encodePacked(_course)) == keccak256(abi.encodePacked("biology"))) {
            students[_class][_studentId].biology = _grade;
        } else if (keccak256(abi.encodePacked(_course)) == keccak256(abi.encodePacked("maths"))) {
            students[_class][_studentId].maths = _grade;
        } else if (keccak256(abi.encodePacked(_course)) == keccak256(abi.encodePacked("french"))) {
            students[_class][_studentId].french = _grade;
        }  
    }

    function getGrade(string memory _class, uint _studentId, string memory _course) public view returns(uint _grade) {
        if (keccak256(abi.encodePacked(_course)) == keccak256(abi.encodePacked("biology"))) {
            return students[_class][_studentId].biology;
        } else if (keccak256(abi.encodePacked(_course)) == keccak256(abi.encodePacked("maths"))) {
            return students[_class][_studentId].maths;
        } else if (keccak256(abi.encodePacked(_course)) == keccak256(abi.encodePacked("french"))) {
            return students[_class][_studentId].french;
        } 
    }

    function getGrades(string memory _class, uint _studentId) public view returns(StudentGrades memory _grades) {
        return students[_class][_studentId];
    }

    function studentAverage(string memory _class, uint _studentId) public view returns(uint _generalAverage) {
        return (students[_class][_studentId].biology + 
                students[_class][_studentId].maths   + 
                students[_class][_studentId].french) / 3;
    }

    function courseClassAverage(string memory _class, string memory _course) public view returns(uint _courseClassAverage) {
        uint courseAverage = 0;
        for (uint i = 0 ; i < students[_class].length; i++) {
            if (keccak256(abi.encodePacked(_course)) == keccak256(abi.encodePacked("biology"))) {
                courseAverage += students[_class][i].biology;
            } else if (keccak256(abi.encodePacked(_course)) == keccak256(abi.encodePacked("maths"))) {
                courseAverage += students[_class][i].maths;
            } else if (keccak256(abi.encodePacked(_course)) == keccak256(abi.encodePacked("french"))) {
                courseAverage += students[_class][i].french;
            } 
        }
        return courseAverage / (students[_class].length);
    }

    function generalClassAverage(string memory _class) public view returns(uint _generalClassAverage) {
        uint result;
        for (uint i = 0; i < students[_class].length; i++) {
            result += this.studentAverage(_class, i);
        }
        return result / (students[_class].length -1);
    }

    function isGraduated(string memory _class, uint _studentId) public view returns(bool) {
        if (this.studentAverage(_class, _studentId) > 10) {
            return true;
        } else {
            return false;
        }
    }

    function stringEquals() public {}
}