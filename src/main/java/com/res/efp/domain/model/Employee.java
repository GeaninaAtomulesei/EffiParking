package com.res.efp.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by gatomulesei on 2/5/2018.
 */
@Entity
public class Employee extends User {

    @ManyToMany
    @JsonIgnore
    private List<Parking> parkingList = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "ownerId")
    private Owner owner;

    public List<Parking> getParkingList() {
        return parkingList;
    }

    public void setParkingList(List<Parking> parkingList) {
        this.parkingList = parkingList;
    }

    public Owner getOwner() {
        return owner;
    }

    public void setOwner(Owner owner) {
        this.owner = owner;
    }
}
