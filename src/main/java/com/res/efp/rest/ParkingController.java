package com.res.efp.rest;

import com.res.efp.domain.model.*;
import com.res.efp.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by gatomulesei on 2/6/2018.
 */
@RestController
@RequestMapping(value = "/api/parkings")
public class ParkingController {

    @Autowired
    private ParkingService parkingService;

    @Autowired
    private OwnerService ownerService;

    @Autowired
    private LotService lotService;

    @Autowired
    private UserService userService;

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private EmployeeService employeeService;

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public ResponseEntity<?> addParkingArea(@RequestBody Parking parking,
                                            @RequestParam(value = "owner") String ownerUsername) {

        Owner owner = ownerService.findByUsername(ownerUsername);
        parkingService.addParkingArea(parking, owner);
        return ResponseEntity.ok(parking);
    }

    @RequestMapping(value = "/all", method = RequestMethod.GET)
    public ResponseEntity<?> getAllParkingAreas() {
        List<Parking> allParkingAreas = parkingService.getAllParkingAreas();
        return ResponseEntity.ok(allParkingAreas);
    }

    @RequestMapping(value = "/getById", method = RequestMethod.GET)
    public ResponseEntity<?> getById(@RequestParam(value = "id") Long parkingAreaId) {
        Parking parking = parkingService.getParkingArea(parkingAreaId);

        if(parking == null) {
            return ResponseEntity.badRequest().body("No parking area found.");
        }

        return ResponseEntity.ok(parking);
    }


    @RequestMapping(value = "/getByName/{name}", method = RequestMethod.GET)
    public ResponseEntity<?> getByName(@PathVariable("name") String parkingAreaName) {
        Parking parking = parkingService.findByName(parkingAreaName);

        if(parking == null) {
            return ResponseEntity.badRequest().body("No parking areas found by this name.");
        }

        return ResponseEntity.ok(parking);
    }

    @RequestMapping(value = "/getByStreet/{name}", method = RequestMethod.GET)
    public ResponseEntity<?> getByStreet(@PathVariable("name") String streetName) {
        List<Parking> parkings = parkingService.findByStreet(streetName);

        if((parkings == null) || (parkings.isEmpty())) {
            return ResponseEntity.badRequest().body("No parking areas found by this street name.");
        }

        return ResponseEntity.ok(parkings);
    }

    @RequestMapping(value = "/getByStreetAndNumber/{street}/{no}", method = RequestMethod.GET)
    public ResponseEntity<?> getByStreetAndNumber(@PathVariable("street") String street,
                                                  @PathVariable("no") String number) {

        List<Parking> parkings = parkingService.findByStreetAndNumber(street, number);

        if((parkings == null) || (parkings.isEmpty())) {
            return ResponseEntity.badRequest().body("No parking areas found.");
        }

        return ResponseEntity.ok(parkings);
    }

    @RequestMapping(value = "/update", method = RequestMethod.PUT)
    public ResponseEntity<?> updateParkingArea(@RequestBody Parking parking,
                                               @RequestParam(value = "id") Long parkingId) {

        if(parkingService.getParkingArea(parkingId) == null) {
            return ResponseEntity.badRequest().body(new ObjectError("parking", "Parking not found."));
        }

        parkingService.updateParkingArea(parking, parkingId);
        return ResponseEntity.ok(parking);
    }

    @RequestMapping(value = "/deleteParking", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteParkingArea(@RequestParam(value = "id") Long parkingId) {

        if(parkingService.getParkingArea(parkingId) == null) {
            return ResponseEntity.badRequest().body(new ObjectError("parking", "Parking not found."));
        }

        Parking parking = parkingService.getParkingArea(parkingId);
        parkingService.deleteParkingArea(parking);
        return ResponseEntity.ok(parkingId);
    }

    @RequestMapping(value = "/getByOwner", method = RequestMethod.GET)
    public ResponseEntity<?> getByOwner(@RequestParam(value = "name") String ownerName) {
        List<Parking> parkings = parkingService.findByOwner(ownerName);

        if((parkings == null) || (parkings.isEmpty())) {
            return ResponseEntity.badRequest().body("No parking areas found for this owner.");
        }

        return ResponseEntity.ok(parkings);
    }

    @RequestMapping(value = "/getClosest", method = RequestMethod.GET)
    public ResponseEntity<?> getClosestParkingAreas(@RequestParam(value = "lat") String latitude,
                                                    @RequestParam(value = "long") String longitude) {

        Map<String, Double> closestParkingAreas = parkingService.getClosestParkingAreas(Double.parseDouble(latitude), Double.parseDouble(longitude));

        Set<String> parkingSet = closestParkingAreas.keySet();
        List<String> parkingsNameList = new ArrayList<>(parkingSet);
        List<Parking> parkings = new ArrayList<>();

        for(String s : parkingsNameList) {
            Parking p = parkingService.findByName(s);
            parkings.add(p);
        }

        if((parkings == null) || (parkings.isEmpty())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No parking areas found!");
        }

        return ResponseEntity.ok(parkings);
    }

    @RequestMapping(value = "/addLots", method = RequestMethod.PUT)
    public ResponseEntity<?> addLots(@RequestParam("parkingId") Long parkingId,
                                     @RequestParam("numberOfLots") int numberOfLots) {

        Parking parking = parkingService.getParkingArea(parkingId);
        if(parking == null) {
            return ResponseEntity.badRequest().body(new ObjectError("parking", "Parking not found."));
        }

        lotService.addToParking(parking, numberOfLots);
        return ResponseEntity.ok(parking);
    }

    @RequestMapping(value = "/removeLots", method = RequestMethod.PUT)
    public ResponseEntity<?> removeLots(@RequestParam("parkingId") Long parkingId,
                                        @RequestParam("numberOfLots") int numberOfLots) {
        Parking parking = parkingService.getParkingArea(parkingId);
        if(parking == null) {
            return ResponseEntity.badRequest().body(new ObjectError("parking", "Parking not found."));
        }

        lotService.removeFromParking(parking, numberOfLots);
        return ResponseEntity.ok(parking);
    }

    @RequestMapping(value = "/addReservation", method = RequestMethod.POST)
    public ResponseEntity<?> addReservation(@RequestBody Reservation reservation,
                                            @RequestParam(value = "parkingId") Long parkingId,
                                            @RequestParam(value = "username") String username) {

        User user = userService.findByUsername(username);
        if(user == null) {
            return ResponseEntity.badRequest().body(new ObjectError("user", "User not found."));
        }

        Parking parking = parkingService.getParkingArea(parkingId);
        if(parking == null) {
            return ResponseEntity.badRequest().body(new ObjectError("parking", "Parking area not found."));
        }

        Reservation currentReservation = reservationService.addReservation(reservation, user, parking);
        if(currentReservation == null) {
            return ResponseEntity.badRequest().body(new ObjectError("reservation", "Reservation not possible!"));
        }

        return ResponseEntity.ok(reservation.getLot().getNumber());
    }

    @RequestMapping(value = "/removeReservation/{reservationId}", method = RequestMethod.DELETE)
    public ResponseEntity<?> removeReservation(@PathVariable("reservationId") Long reservationId) {

        Reservation reservation = reservationService.getReservation(reservationId);

        if(reservation == null) {
            return ResponseEntity.badRequest().body(new ObjectError("reservation", "Reservation not found."));
        }

        reservationService.deleteReservation(reservation);
        return ResponseEntity.ok(reservationId);
    }

    @RequestMapping(value = "/addEmployee", method = RequestMethod.PUT)
    public ResponseEntity<?> addEmployee(@RequestParam("parkingId") Long parkingId,
                                         @RequestParam("employeeId") Long employeeId) {
        Parking parking = parkingService.getParkingArea(parkingId);
        if(parking == null) {
            return ResponseEntity.badRequest().body(new ObjectError("parking", "Parking area not found."));
        }

        Employee employee = employeeService.findById(employeeId);
        if(employee == null) {
            return ResponseEntity.badRequest().body(new ObjectError("user", "Employee not found."));
        }

        if(parking.getEmployees().contains(employee)) {
            return ResponseEntity.badRequest().body(new ObjectError("user", "Parking already contains user!"));
        }

        parkingService.addEmployee(parking, employee);
        return ResponseEntity.ok(parking);
    }

    @RequestMapping(value = "/removeEmployee", method = RequestMethod.PUT)
    public ResponseEntity<?> removeEmployee(@RequestParam("parkingId") Long parkingId,
                                            @RequestParam("employeeId") Long employeeId) {

        Employee employee = employeeService.findById(employeeId);
        if (employee == null) {
            return ResponseEntity.badRequest().body(new ObjectError("user", "Employee not found."));
        }

        Parking parking = parkingService.getParkingArea(parkingId);
        if (parking == null) {
            return ResponseEntity.badRequest().body(new ObjectError("parking", "Parking area not found."));
        }

        employeeService.removeEmployee(employee, parking);
        return ResponseEntity.ok(parking);
    }


    @RequestMapping(value = "/getByEmployee", method = RequestMethod.GET)
    public ResponseEntity<?> getByEmployee(@RequestParam(value = "employeeId") Long employeeId) {
        Employee employeeObject = employeeService.findById(employeeId);

        if(employeeObject == null) {
            return ResponseEntity.badRequest().body(new ObjectError("user", "Employee not found."));
        }

        List<Parking> parkings = parkingService.findByEmployee(employeeObject);
        return ResponseEntity.ok(parkings);
    }

    @RequestMapping(value = "/getLots/{parkingId}", method = RequestMethod.GET)
    public ResponseEntity<?> getLots(@PathVariable("parkingId") Long parkingId) {
        Parking parking = parkingService.getParkingArea(parkingId);
        if(parking == null) {
            return ResponseEntity.badRequest().body(new ObjectError("parking", "Parking area not found."));
        }

        List<Lot> lots = lotService.findByParkingId(parkingId);
        return ResponseEntity.ok(lots);
    }

    @RequestMapping(value = "/getAvailableLots/{parkingId}", method = RequestMethod.GET)
    public ResponseEntity<?> getAvailableLots(@PathVariable("parkingId") Long parkingId) {
        Parking parking = parkingService.getParkingArea(parkingId);
        if(parking == null) {
            return ResponseEntity.badRequest().body(new ObjectError("parking", "Parking area not found."));
        }

        List<Lot> lots = lotService.getAvailable(parking);
        if(lots != null) {
            return ResponseEntity.ok(lots);
        } else {
            List<Lot> availableLotsToday = lotService.getAvailableToday(parking);
            if(availableLotsToday != null) {
                return ResponseEntity.ok(availableLotsToday);
            } else {
                return ResponseEntity.noContent().build();
            }
        }
    }

    @RequestMapping(value = "/searchByTerm", method = RequestMethod.GET)
    public ResponseEntity<?> searchByTerm(@RequestParam("term") String term) {
        List<Parking> foundParkings = parkingService.findByTerm(term);
        return ResponseEntity.ok(foundParkings);
    }

    @RequestMapping(value = "/searchByTermAndOwner", method = RequestMethod.GET)
    public ResponseEntity<?> searchByTermAndOwner(@RequestParam("term") String term,
                                                  @RequestParam("ownerId") Long ownerId) {
        if(ownerService.findById(ownerId) == null) {
            return ResponseEntity.badRequest().body(new ObjectError("owner", "Owner not found!"));
        }
        List<Parking> foundParkings = parkingService.findByTermAndOwner(term, ownerId);
        return ResponseEntity.ok(foundParkings);
    }
}
