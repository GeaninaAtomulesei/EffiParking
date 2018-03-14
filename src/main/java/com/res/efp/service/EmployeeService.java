package com.res.efp.service;

import com.res.efp.domain.model.Employee;
import com.res.efp.domain.model.Owner;
import com.res.efp.domain.model.Parking;

import java.util.List;

/**
 * Created by gatomulesei on 2/5/2018.
 */
public interface EmployeeService {
    Employee findById(Long id);
    Employee findByUsername(String username);
    List<Employee> findAllEmployees();
    List<Employee> findByOwnerId(Long ownerId);
    Employee saveEmployee(Employee employee, Owner owner);
    void removeEmployee(Employee employee, Parking parking);
    List<Employee> getByTermAndOwnerId(Long ownerId, String term);
    Employee updateEmployee(Employee employee, Long employeeId);
    void deleteEmployee(Employee employee);
}
