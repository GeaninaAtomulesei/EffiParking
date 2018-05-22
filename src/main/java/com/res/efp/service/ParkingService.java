package com.res.efp.service;

import com.res.efp.domain.model.Employee;
import com.res.efp.domain.model.Lot;
import com.res.efp.domain.model.Owner;
import com.res.efp.domain.model.Parking;

import java.util.List;
import java.util.Map;

/**
 * Created by gatomulesei on 2/6/2018.
 */
public interface ParkingService {
    Parking addParkingArea(Parking parking, Owner owner);
    List<Parking> getAllParkingAreas();
    Parking getParkingArea(Long id);
    Parking findByName(String name);
    List<Parking> findByStreet(String street);
    List<Parking> findByStreetAndNumber(String street, String number);
    Parking updateParkingArea(Parking parking, Long parkingId);
    void deleteParkingArea(Parking parking);
    List<Parking> findByOwner(String owner);
    List<Parking> findByEmployee(Employee employee);
    Parking addEmployee(Parking parking, Employee employee);
    Map<String, Double> getClosestParkingAreas(double latitude, double longitude);
    List<Parking> findByTerm(String term);
    List<Parking> findByTermAndOwner(String term, Long ownerId);
    Parking findById(Long parkingId);
    int getAvailableLots(Long parkingId);
    List<Lot> getLots(Long parkingId);
}
