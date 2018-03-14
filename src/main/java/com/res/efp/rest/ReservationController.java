package com.res.efp.rest;

import com.res.efp.domain.model.Parking;
import com.res.efp.domain.model.Reservation;
import com.res.efp.domain.model.User;
import com.res.efp.service.ParkingService;
import com.res.efp.service.ReservationService;
import com.res.efp.service.UserService;
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
@RequestMapping(value = "/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private UserService userService;

    @Autowired
    private ParkingService parkingService;

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<?> getAllReservations() {
        List<Reservation> allReservations = reservationService.getAllReservations();

        if((allReservations == null) || (allReservations.isEmpty())) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return ResponseEntity.ok(allReservations);
    }

    @RequestMapping(value = "/cancel", method = RequestMethod.DELETE)
    public ResponseEntity<?> cancelReservation(@RequestParam("id") Long reservationId) {

        if(reservationService.getReservation(reservationId) == null) {
            return ResponseEntity.badRequest().body(new ObjectError("reservation", "Reservation not found."));
        }

        Reservation reservation = reservationService.getReservation(reservationId);
        reservationService.deleteReservation(reservation);
        return ResponseEntity.ok(reservationId);
    }

    @RequestMapping(value = "/getUserReservations", method = RequestMethod.GET)
    public ResponseEntity<?> getUserReservations(@RequestParam(value = "userId") Long userId) {

        User user = userService.findById(userId);
        if(user == null) {
            return ResponseEntity.badRequest().body(new ObjectError("user", "User not found."));
        }
        List<Reservation> reservations = reservationService.findByUser(userId);
        return ResponseEntity.ok(reservations);
    }

    @RequestMapping(value = "/getForParking", method = RequestMethod.GET)
    public ResponseEntity<?> getReservationsForParking(@RequestParam("parkingId") Long parkingId) {
        Parking parking = parkingService.getParkingArea(parkingId);

        if(parking == null) {
            return ResponseEntity.badRequest().body(new ObjectError("parking", "Parking area not found."));
        }

        List<Reservation> reservations = reservationService.findByParkingArea(parkingId);
        return ResponseEntity.ok(reservations);
    }

    @RequestMapping(value = "/findByUserNames", method = RequestMethod.GET)
    public ResponseEntity<?> findByUserNames(@RequestParam("parkingId") Long parkingId,
                                             @RequestParam("name") String name) {

        Parking parking = parkingService.getParkingArea(parkingId);
        if(parking == null) {
            return ResponseEntity.badRequest().body(new ObjectError("parking", "Parking area not found."));
        }

        List<Reservation> reservations = reservationService.findByUsername(parkingId, name);
        return ResponseEntity.ok(reservations);
    }
}
