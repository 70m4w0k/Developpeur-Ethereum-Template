// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

contract Grades {
    struct StudentGrades {
        uint biology;
        uint maths;
        uint french;
    }
    // professor's address => course's name (biology,maths, french)
    mapping(address => string) public professors;

    StudentGrades[] public students;

    constructor() {
        professors[0x5B38Da6a701c568545dCfcB03FcB875f56beddC4] = "biology";
        professors[0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2] = "maths";
        professors[0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db] = "french";
        professors[0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB] = "biology";
        professors[0x617F2E2fD72FD9D5503197092aC168c91465E7f2] = "maths";
        professors[0x17F6AD8Ef982297579C203069C1DbfFE4348c372] = "french";
    }

    function addGrade(uint _biology, uint _maths, uint _french) public {
        students.push(StudentGrades(_biology, _maths, _french));  
    }

    function setGrade(uint _studentId, string memory _course, uint _grade) public {
        require(keccak256(abi.encodePacked(professors[msg.sender])) == keccak256(abi.encodePacked(_course)), "You are not the right professor");
        if (keccak256(abi.encodePacked(_course)) == keccak256(abi.encodePacked("biology"))) {
            students[_studentId].biology = _grade;
        } else if (keccak256(abi.encodePacked(_course)) == keccak256(abi.encodePacked("maths"))) {
            students[_studentId].maths = _grade;
        } else if (keccak256(abi.encodePacked(_course)) == keccak256(abi.encodePacked("french"))) {
            students[_studentId].french = _grade;
        }  
    }

    function getGrade(uint _studentId, string memory _course) public view returns(uint _grade) {
        if (keccak256(abi.encodePacked(_course)) == keccak256(abi.encodePacked("biology"))) {
            return students[_studentId].biology;
        } else if (keccak256(abi.encodePacked(_course)) == keccak256(abi.encodePacked("maths"))) {
            return students[_studentId].maths;
        } else if (keccak256(abi.encodePacked(_course)) == keccak256(abi.encodePacked("french"))) {
            return students[_studentId].french;
        } 
    }

    function getGrades(uint _studentId) public view returns(StudentGrades memory _grades) {
        return students[_studentId];
    }

    function studentAverage(uint _studentId) public view returns(uint _generalAverage) {
        return (students[_studentId].biology + students[_studentId].maths + students[_studentId].french) / 3;
    }

    function courseClassAverage(string memory _course) public view returns(uint _courseClassAverage) {
        uint courseAverage = 0;
        for (uint i = 0 ; i < students.length; i++) {
            if (keccak256(abi.encodePacked(_course)) == keccak256(abi.encodePacked("biology"))) {
                courseAverage += students[i].biology;
            } else if (keccak256(abi.encodePacked(_course)) == keccak256(abi.encodePacked("maths"))) {
                courseAverage += students[i].maths;
            } else if (keccak256(abi.encodePacked(_course)) == keccak256(abi.encodePacked("french"))) {
                courseAverage += students[i].french;
            } 
        }
        return courseAverage / (students.length);
    }

    function generalClassAverage() public view returns(uint _generalClassAverage) {
        uint result;
        for (uint i = 0; i < students.length; i++) {
            result += this.studentAverage(i);
        }
        return result / (students.length -1);
    }

    function isGraduated(uint _studentId) public view returns(bool) {
        if (this.studentAverage(_studentId) > 10) {
            return true;
        } else {
            return false;
        }
    }
}