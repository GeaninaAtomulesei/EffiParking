package com.res.efp.utils;

import com.res.efp.domain.model.Lot;
import com.res.efp.domain.model.Parking;
import com.res.efp.domain.model.Reservation;
import com.res.efp.domain.repository.LotRepository;
import com.res.efp.domain.repository.ParkingRepository;
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

    @Scheduled(fixedRate = 30000)
    public void updateAvailableLots() {
        List<Parking> allParkingAreas = parkingRepository.findAll();
        for(Parking parking : allParkingAreas) {
            setAvailableLotsPerParking(parking);
        }
        System.out.println("++++++++++++++   Finished updating vacant lots   ++++++++++++++++");
    }


    private void setAvailableLotsPerParking(Parking parking) {
        List<Lot> vacantLots = lotRepository.findVacantLotsPerParking(parking.getId());
        parking.setAvailableLots(vacantLots.size());
        parkingRepository.save(parking);
        System.out.println("------------   Updating vacant lots for parking area " + parking.getName() + " --------------------");
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
}
