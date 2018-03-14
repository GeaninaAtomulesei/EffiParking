package com.res.efp.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by gatomulesei on 2/5/2018.
 */
@Entity
public class Owner extends User {

    private static final Long serialVersionUID = 1L;
    private String organisation;

    @OneToMany(mappedBy = "owner")
    @JsonIgnore
    private List<Parking> parkingList = new ArrayList<>();

    @OneToMany(mappedBy = "owner")
    @JsonIgnore
    private List<Employee> employeeList = new ArrayList<>();

    public String getOrganisation() {
        return organisation;
    }

    public void setOrganisation(String organisation) {
        this.organisation = organisation;
    }

    public List<Parking> getParkingList() {
        return parkingList;
    }

    public void setParkingList(List<Parking> parkingList) {
        this.parkingList = parkingList;
    }

    public List<Employee> getEmployeeList() {
        return employeeList;
    }

    public void setEmployeeList(List<Employee> employeeList) {
        this.employeeList = employeeList;
    }
}
