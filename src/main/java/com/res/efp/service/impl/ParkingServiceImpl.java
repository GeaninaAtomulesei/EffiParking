package com.res.efp.service.impl;

import com.res.efp.domain.model.Employee;
import com.res.efp.domain.model.Lot;
import com.res.efp.domain.model.Owner;
import com.res.efp.domain.model.Parking;
import com.res.efp.domain.repository.EmployeeRepository;
import com.res.efp.domain.repository.LotRepository;
import com.res.efp.domain.repository.ParkingRepository;
import com.res.efp.service.ParkingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * Created by gatomulesei on 2/6/2018.
 */
@Service
@Transactional
public class ParkingServiceImpl implements ParkingService {

    @Autowired
    private ParkingRepository parkingRepository;

    @Autowired
    private LotRepository lotRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public Parking addParkingArea(Parking parking, Owner owner) {
        parking.setOwner(owner);
        parking.setAvailableLots(parking.getTotalLots());
        List<Lot> lots = new ArrayList<>();
        for(int i = 0; i < parking.getTotalLots(); i++) {
            Lot lot = new Lot();
            lotRepository.save(lot);
            lot.setNumber(i);
            lot.setParking(parking);
            lot.setVacant(true);
            lot.setReserved(false);
            lotRepository.save(lot);
            lots.add(lot);
        }
        owner.getParkingList().add(parking);
        return parkingRepository.save(parking);
    }

    @Override
    public List<Parking> getAllParkingAreas() {
        return parkingRepository.findAll();
    }

    @Override
    public Parking getParkingArea(Long id) {
        return parkingRepository.findOne(id);
    }

    @Override
    public Parking findByName(String name) {
        return parkingRepository.findByName(name);
    }

    @Override
    public List<Parking> findByStreet(String street) {
        return parkingRepository.findByStreet(street);
    }

    @Override
    public List<Parking> findByStreetAndNumber(String street, String number) {
        return parkingRepository.findByStreetAndNumber(street, number);
    }

    @Override
    public Parking updateParkingArea(Parking parking, Long parkingId) {
        Parking currentParking = parkingRepository.findOne(parkingId);

        if(parking.getName() != null && !parking.getName().isEmpty()) {
            currentParking.setName(parking.getName());
        }

        if(parking.getLocationName() != null && !parking.getLocationName().isEmpty()) {
            currentParking.setLocationName(parking.getLocationName());
        }

        if(parking.getCity() != null && !parking.getCity().isEmpty()) {
            currentParking.setCity(parking.getCity());
        }

        if(parking.getStreet() != null && !parking.getStreet().isEmpty()) {
            currentParking.setStreet(parking.getStreet());
        }

        if(parking.getNumber() != null && !parking.getNumber().isEmpty()) {
            currentParking.setNumber(parking.getNumber());
        }

        if(parking.getLatitude() != 0) {
            currentParking.setLatitude(parking.getLatitude());
        }

        if(parking.getLongitude() != 0) {
            currentParking.setLongitude(parking.getLongitude());
        }

        return parkingRepository.save(currentParking);
    }

    @Override
    public void deleteParkingArea(Parking parking) {
        for(Employee e : parking.getEmployees()) {
            e.getParkingList().remove(parking);
        }
        parking.getEmployees().clear();
        parkingRepository.delete(parking);
    }

    @Override
    public List<Parking> findByOwner(String owner) {
        return parkingRepository.findByOwnerUsername(owner);
    }

    @Override
    public List<Parking> findByEmployee(Employee employee) {
        List<Parking> parkingList = parkingRepository.findAll();
        List<Parking> employeeParkingList = new ArrayList<>();
        for(Parking p : parkingList) {
            if(p.getEmployees().contains(employee)) {
                employeeParkingList.add(p);
            }
        }
        return employeeParkingList;
    }

    @Override
    public Parking addEmployee(Parking parking, Employee employee) {
        parking.getEmployees().add(employee);
        employee.getParkingList().add(parking);
        parkingRepository.save(parking);
        employeeRepository.save(employee);
        return parking;
    }

    @Override
    public Map<String, Double> getClosestParkingAreas(double latitude, double longitude) {
        List<Parking> allParkingAreas = parkingRepository.findAll();
        Map<String, Double> parkingMap = new LinkedHashMap<>();

        for(Parking p : allParkingAreas) {
            double distance = computeDistance(latitude, longitude, p.getLatitude(), p.getLongitude());
            parkingMap.put(p.getName(), distance);
        }
        return sortByValue(parkingMap);
    }

    @Override
    public List<Parking> findByTerm(String term) {
        return parkingRepository.findByTerm(term);
    }

    @Override
    public List<Parking> findByTermAndOwner(String term, Long ownerId) {
        return parkingRepository.findByTermAndOwner(term , ownerId);
    }

    @Override
    public Parking findById(Long parkingId) {
        return parkingRepository.findOne(parkingId);
    }

    @Override
    public int getAvailableLots(Long parkingId) {
        Parking parking = parkingRepository.findOne(parkingId);
        return parking.getAvailableLots();
    }

    @Override
    public List<Lot> getLots(Long parkingId) {
        Parking parking = parkingRepository.findOne(parkingId);
        return parking.getLots();
    }

    private static <K, V extends Comparable<? super V>> Map<K, V> sortByValue(Map<K, V> map) {
        List<Map.Entry<K, V>> list = new LinkedList<>(map.entrySet());
        list.sort(Comparator.comparing(o -> (o.getValue())));

        Map<K, V> result = new LinkedHashMap<>();
        for (Map.Entry<K, V> entry : list) {
            result.put(entry.getKey(), entry.getValue());
        }
        return result;
    }

    private double computeDistance(double lat1, double lng1, double lat2, double lng2) {
        double earthRadius = 6371000; //meters
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLng/2) * Math.sin(dLng/2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return earthRadius * c;
    }
}
