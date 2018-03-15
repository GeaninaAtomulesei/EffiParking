package com.res.efp.service.impl;

import com.res.efp.domain.model.Authority;
import com.res.efp.domain.model.Employee;
import com.res.efp.domain.model.Owner;
import com.res.efp.domain.model.Parking;
import com.res.efp.domain.repository.EmployeeRepository;
import com.res.efp.domain.repository.OwnerRepository;
import com.res.efp.domain.repository.ParkingRepository;
import com.res.efp.service.AuthorityService;
import com.res.efp.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by gatomulesei on 2/5/2018.
 */
@Service
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AuthorityService authorityService;

    @Autowired
    private ParkingRepository parkingRepository;

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Employee findById(Long id) {
        return employeeRepository.findOne(id);
    }

    @Override
    public Employee findByUsername(String username) {
        return employeeRepository.findByUsername(username);
    }

    @Override
    public List<Employee> findAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public List<Employee> findByOwnerId(Long ownerId) {
        return employeeRepository.findByOwnerId(ownerId);
    }

    @Override
    public Employee saveEmployee(Employee employee, Owner owner) {
        employee.setPassword(passwordEncoder.encode(employee.getPassword()));
        List<Authority> employeeAuth = authorityService.findByName("ROLE_EMPLOYEE");
        if(employeeAuth == null || employeeAuth.isEmpty() || employeeAuth.get(0) == null) {
            List<Authority> authorities = new ArrayList<>();
            Authority authority = new Authority();
            authority.setName("ROLE_EMPLOYEE");
            authorityService.saveAuthority(authority);
            authorities.add(authority);
            employee.setAuthorities(authorities);
        } else {
            employee.setAuthorities(employeeAuth);
        }
        employee.setOwner(owner);
        Employee savedEmployee = this.employeeRepository.save(employee);
        owner.getEmployeeList().add(savedEmployee);
        ownerRepository.save(owner);
        return savedEmployee;
    }




    @Override
    public void removeEmployee(Employee employee, Parking parking) {
        employee.getParkingList().remove(parking);
        parking.getEmployees().remove(employee);
        employeeRepository.save(employee);
        parkingRepository.save(parking);
    }

    @Override
    public List<Employee> getByTermAndOwnerId(Long ownerId, String term) {
        return employeeRepository.findByTermAndOwnerId(ownerId, term);
    }

    @Override
    public Employee updateEmployee(Employee employee, Long employeeId) {
        Employee currentEmployee = employeeRepository.findOne(employeeId);

        if(employee.getFirstName() != null && !employee.getFirstName().isEmpty()) {
            currentEmployee.setFirstName(employee.getFirstName());
        }
        if(employee.getLastName() != null && !employee.getLastName().isEmpty()) {
            currentEmployee.setLastName(employee.getLastName());
        }
        if(employee.getEmail() != null && !employee.getEmail().isEmpty()) {
            currentEmployee.setEmail(employee.getEmail());
        }
        if(employee.getUsername() != null & !employee.getUsername().isEmpty()) {
            currentEmployee.setUsername(employee.getUsername());
        }
        if(employee.getPassword() != null & !employee.getPassword().isEmpty()) {
            currentEmployee.setPassword(passwordEncoder.encode(employee.getPassword()));
        }
        return employeeRepository.save(currentEmployee);
    }

    @Override
    public void deleteEmployee(Employee employee) {
        for(Parking parking : employee.getParkingList()) {
            parking.getEmployees().remove(employee);
        }
        employee.getParkingList().clear();
        Owner owner = employee.getOwner();
        owner.getEmployeeList().remove(employee);
        employee.setOwner(null);
        employeeRepository.delete(employee);
    }
}
