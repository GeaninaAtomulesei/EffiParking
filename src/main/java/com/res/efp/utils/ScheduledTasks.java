package com.res.efp.utils;

import com.res.efp.domain.model.Lot;
import com.res.efp.domain.model.Parking;
import com.res.efp.domain.model.Reservation;
import com.res.efp.domain.repository.LotRepository;
import com.res.efp.domain.repository.ParkingRepository;
import com.res.efp.domain.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by gatomulesei on 2/6/2018.
 */
@Component
public class ScheduledTasks {

    @Autowired
    private LotRepository lotRepository;

    @Autowired
    private ParkingRepository parkingRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Scheduled(fixedRate = 30000)
    public void updateAvailableLots() {
        List<Parking> allParkingAreas = parkingRepository.findAll();
        for(Parking parking : allParkingAreas) {
            setAvailableLotsPerParking(parking);
        }
        System.out.println("++++++++++++++   Finished updating vacant lots   ++++++++++++++++");
    }

    @Scheduled(fixedRate = 30000)
    public void updateReservedLots() {
        System.out.println("+++++++++++++++++++++ Updating reserved lots ++++++++++++++++++++++++");
        List<Lot> totalLots = lotRepository.findAll();
        List<Lot> reservedLots = new ArrayList<>();
        List<Reservation> actualReservations = new ArrayList<>();
        for (Lot lot : totalLots) {
            if(lot.isReserved()) {
                reservedLots.add(lot);
            }
        }

        for(Lot lot : reservedLots) {
            List<Reservation> reservations = lot.getReservations();
            for(Reservation reservation : reservations) {
                if(!reservation.getEndDate().isBefore(LocalDateTime.now())) {
                    actualReservations.add(reservation);
                }
            }

            if(actualReservations.isEmpty()) {
                lot.setReserved(false);
                lotRepository.save(lot);
            }
        }
        System.out.println("++++++++++++++++++++ Finished updating reserved lots +++++++++++++++++++++++");
    }

    @Scheduled(fixedRate = 30000)
    public void deleteOldReservations() {
        System.out.println("++++++++++++++++++++++++++ Started to delete old reservations +++++++++++++++++++++++++");
        List<Reservation> reservationList = reservationRepository.findAll();
        List<Reservation> oldReservations = new ArrayList<>();
        LocalDateTime currentDate = LocalDateTime.now();
        for(Reservation reservation : reservationList) {
            if(reservation.getEndDate().getYear() == currentDate.getYear()) {
                if(reservation.getEndDate().getDayOfYear() < currentDate.getDayOfYear()) {
                    oldReservations.add(reservation);
                }
                if(reservation.getEndDate().getDayOfYear() == currentDate.getDayOfYear()) {
                    if(reservation.getEndDate().isBefore(currentDate)) {
                        oldReservations.add(reservation);
                    }
                }
            }
        }
        reservationRepository.delete(oldReservations);
        System.out.println("++++++++++++++++++++ Finished deleting old reservations ++++++++++++++++++++");
    }

    private void setAvailableLotsPerParking(Parking parking) {
        List<Lot> parkingLots = lotRepository.findByParkingId(parking.getId());
        List<Lot> availableLots = new ArrayList<>();

        for(Lot lot : parkingLots) {
            List<Reservation> reservationList = lot.getReservations();
            if(reservationList == null || reservationList.isEmpty()) {
                availableLots.add(lot);
            } else {
                for(Reservation reservation : reservationList) {
                    if(!isOverlapping(reservation.getStartDate(), reservation.getEndDate(), LocalDateTime.now().minusHours(1), LocalDateTime.now().plusHours(1))) {
                        availableLots.add(lot);
                    }
                }
            }
        }
        parking.setAvailableLots(availableLots.size());
        parkingRepository.save(parking);
        System.out.println("------------   Finished updating vacant lots for parking area " + parking.getName() + " --------------------");
    }

    private static boolean isOverlapping(LocalDateTime start1, LocalDateTime end1, LocalDateTime start2, LocalDateTime end2) {
        return !start1.isAfter(end2) && !start2.isAfter(end1);
    }
}
