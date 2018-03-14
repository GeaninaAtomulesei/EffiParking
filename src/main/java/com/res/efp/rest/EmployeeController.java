package com.res.efp.rest;

import com.res.efp.domain.model.Employee;
import com.res.efp.domain.model.Owner;
import com.res.efp.exception.ResourceConflictException;
import com.res.efp.service.EmployeeService;
import com.res.efp.service.OwnerService;
import com.res.efp.service.ParkingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by gatomulesei on 2/6/2018.
 */
@RestController
@RequestMapping(value = "/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private ParkingService parkingService;

    @Autowired
    private OwnerService ownerService;

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<?> getAllEmployees() {
        List<Employee> employees = employeeService.findAllEmployees();
        if ((employees == null) || (employees.isEmpty())) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return ResponseEntity.ok(employees);
    }

    @RequestMapping(value = "/getByOwner", method = RequestMethod.GET)
    public ResponseEntity<?> getByOwner(@RequestParam(value = "ownerId") Long ownerId) {
        Owner owner = ownerService.findById(ownerId);
        if (owner == null) {
            return new ResponseEntity<>(ownerId, HttpStatus.NOT_FOUND);
        }
        List<Employee> foundEmployees = employeeService.findByOwnerId(ownerId);
        return ResponseEntity.ok(foundEmployees);
    }

    @RequestMapping(value = "/getById", method = RequestMethod.GET)
    public ResponseEntity<?> getById(@RequestParam(value = "employeeId") Long employeeId) {
        Employee employee = employeeService.findById(employeeId);
        if (employee == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(employee);
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public ResponseEntity<?> createEmployee(@RequestBody Employee employee,
                                            @RequestParam(value = "ownerId") Long ownerId) {
        Owner owner = ownerService.findById(ownerId);
        if (owner == null) {
            return new ResponseEntity<>(ownerId, HttpStatus.NOT_FOUND);
        }

        Employee existingEmployee = this.employeeService.findByUsername(employee.getUsername());
        if (existingEmployee != null) {
            throw new ResourceConflictException(employee.getId(), "Username already exists");
        }

        Employee savedEmployee = this.employeeService.saveEmployee(employee, owner);
        if (savedEmployee != null) {
            return new ResponseEntity<>(employee, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(employee.getId(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/update", method = RequestMethod.PUT)
    public ResponseEntity<?> updateEmployee(@RequestBody Employee employee,
                                            @RequestParam(value = "employeeId") Long employeeId) {
        if(employeeService.findById(employeeId) == null) {
            return ResponseEntity.badRequest().body(new ObjectError("user", "Employee not found."));
        }
        employeeService.updateEmployee(employee, employeeId);
        return ResponseEntity.ok(employee);
    }

    @RequestMapping(value = "/delete", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteEmployee(@RequestParam(value = "employeeId") Long employeeId) {
        Employee employee = employeeService.findById(employeeId);
        if(employee == null) {
            return ResponseEntity.badRequest().body(new ObjectError("user", "Employee not found."));
        }
        employeeService.deleteEmployee(employee);
        return ResponseEntity.ok(employeeId);
    }

    @RequestMapping(value = "/getByTerm", method = RequestMethod.GET)
    public ResponseEntity<?> getByTerm(@RequestParam("ownerId") Long ownerId,
                                       @RequestParam("term") String term) {
        Owner owner = ownerService.findById(ownerId);
        if (owner == null) {
            return ResponseEntity.badRequest().body(new ObjectError("owner", "Owner not found."));
        }

        List<Employee> result = employeeService.getByTermAndOwnerId(ownerId, term);
        return ResponseEntity.ok(result);
    }
}
