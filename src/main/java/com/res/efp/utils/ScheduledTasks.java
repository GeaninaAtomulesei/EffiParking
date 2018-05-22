package com.res.efp.utils;

import com.res.efp.domain.model.Lot;
import com.res.efp.domain.model.Parking;
import com.res.efp.domain.model.Reservation;
import com.res.efp.domain.repository.LotRepository;
import com.res.efp.domain.repository.ParkingRepository;
import com.res.efp.domain.repository.ReservationRepository;
import com.res.efp.service.impl.ArtikCloudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @Autowired
    private ArtikCloudService artikCloudService;

    @Scheduled(fixedRate = 30000)
    public void updateAvailableLots() {
        List<Parking> allParkingAreas = parkingRepository.findAll();
        for (Parking parking : allParkingAreas) {
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
            if (lot.isReserved()) {
                reservedLots.add(lot);
            }
        }

        for (Lot lot : reservedLots) {
            List<Reservation> reservations = lot.getReservations();
            for (Reservation reservation : reservations) {
                if (!reservation.getEndDate().isBefore(LocalDateTime.now())) {
                    actualReservations.add(reservation);
                }
            }

            if (actualReservations.isEmpty()) {
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
        for (Reservation reservation : reservationList) {
            if (reservation.getEndDate().getYear() == currentDate.getYear()) {
                if (reservation.getEndDate().getDayOfYear() < currentDate.getDayOfYear()) {
                    oldReservations.add(reservation);
                }
                if (reservation.getEndDate().getDayOfYear() == currentDate.getDayOfYear()) {
                    if (reservation.getEndDate().isBefore(currentDate)) {
                        oldReservations.add(reservation);
                    }
                }
            }
        }
        reservationRepository.delete(oldReservations);
        System.out.println("++++++++++++++++++++ Finished deleting old reservations ++++++++++++++++++++");
    }

    private void setAvailableLotsPerParking(Parking parking) {
        Map<Integer, Integer> parkingLots = artikCloudService.getData(parking.getName(), parking.getTotalLots());

        if (parking.getAvailableLots() == null) {
            System.out.println(
                    "------------   ERROR in updating vacant lots for parking area " + parking.getName() + " --------------------");
            return;
        }

        Map<Integer, Integer> test = new HashMap<>();
        test.put(0, 1);
        test.put(1, 1);
        test.put(2, 1);


        int noAvailableLots = 0;

        for (Map.Entry<Integer, Integer> entry : parkingLots.entrySet()) {
            if (entry.getValue() == 0) {
                noAvailableLots++;
            }
        }
        parking.setAvailableLots(noAvailableLots);
        parkingRepository.save(parking);

        List<Lot> lots = lotRepository.findByParkingId(parking.getId());
        for (Map.Entry<Integer, Integer> entry : parkingLots.entrySet()) {
            for (Lot lot : lots) {
                if (entry.getKey() == lot.getNumber()) {
                    if (entry.getValue() == 0) {
                        lot.setVacant(true);
                        lotRepository.save(lot);
                    } else {
                        lot.setVacant(false);
                        lotRepository.save(lot);
                    }
                }
            }
        }
        System.out.println(
                "------------   Finished updating vacant lots for parking area " + parking.getName() + " --------------------");
    }
}
