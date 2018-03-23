package com.res.efp.service.impl;

import com.res.efp.domain.model.*;
import com.res.efp.domain.repository.LotRepository;
import com.res.efp.domain.repository.ParkingRepository;
import com.res.efp.domain.repository.ReservationRepository;
import com.res.efp.domain.repository.UserRepository;
import com.res.efp.service.NotificationService;
import com.res.efp.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * Created by gatomulesei on 2/6/2018.
 */
@Service
@Transactional
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private LotRepository lotRepository;

    @Autowired
    private ParkingRepository parkingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Override
    public Reservation addReservation(Reservation reservation, User user, Parking parking) {
        LocalDateTime currentDate = LocalDateTime.now();
        if (reservation.getStartDate().isBefore(currentDate)) {
            return null;
        }
        List<Lot> availableLots = lotRepository.findNotReservedLotsPerParking(parking.getId());
        if ((availableLots != null) && (!availableLots.isEmpty())) {
            Lot lot = availableLots.get(0);
            reservation.setLot(lot);
            lot.getReservations().add(reservation);
            lot.setReserved(true);
            lotRepository.save(lot);
        } else {
            List<Lot> allLots = parking.getLots();
            for (Lot lot : allLots) {
                List<Reservation> reservations = lot.getReservations();
                if((reservations != null) && (reservations.size() != 0)) {
                    for (Reservation res : reservations) {
                        if (((reservation.getStartDate().isBefore(res.getStartDate())) && (reservation.getEndDate().isBefore(res.getEndDate()))) ||
                                ((reservation.getStartDate().isAfter(res.getStartDate())) && (reservation.getEndDate().isAfter(res.getEndDate())))) {
                            reservation.setLot(lot);
                            lot.getReservations().add(reservation);
                            lotRepository.save(lot);
                            break;
                        }
                    }
                } else {
                    reservation.setLot(lot);
                    lot.getReservations().add(reservation);
                    lotRepository.save(lot);
                    break;
                }
            }
        }
        reservation.setUser(user);
        user.getReservations().add(reservation);
        userRepository.save(user);
        reservation.setParking(parking);
        parking.getReservations().add(reservation);
        reservationRepository.save(reservation);
        parkingRepository.save(parking);

        HistoryObject historyObject = new HistoryObject();
        historyObject.setDate(LocalDate.now());
        historyObject.setParkingAreaId(parking.getId());
        historyObject.setParkingAreaName(parking.getName());
        historyObject.setParkingAreaLocation(
                parking.getLocationName() + ", " + parking.getStreet() + " " + parking.getNumber());
        historyObject.setParkingAreaCity(parking.getCity());

        for (HistoryObject object : user.getHistory()) {
            if ((object.getParkingAreaName().equals(historyObject.getParkingAreaName())) &&
                    (object.getParkingAreaLocation().equals(historyObject.getParkingAreaLocation()))) {
                return reservation;
            }
        }
        user.getHistory().add(historyObject);
        userRepository.save(user);
        return reservation;
    }

    @Override
    public Reservation getReservation(Long id) {
        return reservationRepository.findOne(id);
    }

    @Override
    public List<Reservation> findByParkingArea(Long id) {
        List<Reservation> reservations = reservationRepository.findByParkingId(id);
        List<Reservation> actualReservations = new ArrayList<>();

        for (Reservation reservation : reservations) {
            LocalDateTime reservationDate = reservation.getStartDate();
            LocalDateTime currentDate = LocalDateTime.now();

            if (reservationDate.getDayOfYear() == currentDate.getDayOfYear()) {
                actualReservations.add(reservation);
            }
        }

        actualReservations.sort(Comparator.comparing(Reservation::getStartDate));
        return actualReservations;
    }

    @Override
    public List<Reservation> findByUser(Long userId) {
        return reservationRepository.findByUserId(userId);
    }

    @Override
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Override
    public void deleteReservation(Reservation reservation) {
        User user = reservation.getUser();
        Parking parking = reservation.getParking();

        List<Employee> employees = parking.getEmployees();
        Notification notification = new Notification();
        notification.setDate(LocalDateTime.now());
        notification.setMessage(
                "User " + user.getFirstName() + " " + user.getLastName() + " cancelled their reservation " +
                        "for parking area: " + parking.getName() + ", lot number: " + reservation.getLot().getNumber());

        Lot lot = reservation.getLot();
        reservation.setUser(null);
        user.getReservations().remove(reservation);
        reservation.setParking(null);
        parking.getReservations().remove(reservation);
        reservation.setLot(null);
        lot.getReservations().remove(reservation);
        lotRepository.save(lot);
        reservationRepository.delete(reservation);

        notificationService.saveNotification(notification);
        for (Employee employee : employees) {
            notificationService.pushNotification(notification, employee.getId());
        }
    }

    @Override
    public List<Reservation> findByUsername(Long parkingId, String name) {
        List<Reservation> totalReservations = reservationRepository.findByUser(name);
        List<Reservation> currentParkingReservations = new ArrayList<>();

        for (Reservation reservation : totalReservations) {
            if (reservation.getParking().getId().equals(parkingId)) {
                currentParkingReservations.add(reservation);
            }
        }
        List<Reservation> actualReservations = new ArrayList<>();
        for (Reservation reservation : currentParkingReservations) {
            if (!reservation.getEndDate().isBefore(LocalDateTime.now()) ||
                    (reservation.getEndDate().getDayOfYear() == LocalDateTime.now().getDayOfYear())) {
                actualReservations.add(reservation);
            }
        }
        actualReservations.sort(Comparator.comparing(Reservation::getStartDate));
        return actualReservations;
    }

    @Override
    public List<Reservation> findByParkingAndLot(Long parkingId, int lotNumber) {
        Lot lot = lotRepository.findByNumberAndParking(parkingId, lotNumber);
        return lot.getReservations();
    }
}
