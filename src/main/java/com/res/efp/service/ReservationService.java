package com.res.efp.service;

import com.res.efp.domain.model.Parking;
import com.res.efp.domain.model.Reservation;
import com.res.efp.domain.model.User;

import java.util.List;

/**
 * Created by gatomulesei on 2/6/2018.
 */
public interface ReservationService {
    Reservation addReservation(Reservation reservation, User user, Parking parking);
    Reservation getReservation(Long id);
    List<Reservation> findByParkingArea(Long id);
    List<Reservation> findByUser(Long userId);
    List<Reservation> getAllReservations();
    void deleteReservation(Reservation reservation);
    List<Reservation> findByUsername(Long parkingId, String name);
    List<Reservation> findByParkingAndLot(Long parkingId, int lotNumber);
}
