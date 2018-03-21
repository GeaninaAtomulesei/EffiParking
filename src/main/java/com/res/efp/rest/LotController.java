package com.res.efp.rest;

import com.res.efp.domain.model.Lot;
import com.res.efp.service.LotService;
import com.res.efp.service.ParkingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by gatomulesei on 2/6/2018.
 */
@RestController
@RequestMapping(value = "/api/lots")
public class LotController {

    @Autowired
    private LotService lotService;

    @Autowired
    private ParkingService parkingService;

    @RequestMapping(value = "/setOccupied", method = RequestMethod.PUT)
    public ResponseEntity<?> setOccupied(@RequestParam("lotId") Long lotId) {
        Lot lot = lotService.findLot(lotId);
        if(lot == null) {
            return ResponseEntity.badRequest().body(new ObjectError("lot", "Lot not found."));
        }

        if(lot.isVacant()) {
            lotService.setOccupied(lot);
            return ResponseEntity.ok(lot);
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ObjectError("lot", "Lot already occupied."));
        }
    }

    @RequestMapping(value = "/setVacant", method = RequestMethod.PUT)
    public ResponseEntity<?> setVacant(@RequestParam("lotId") Long lotId) {
        Lot lot = lotService.findLot(lotId);
        if(lot == null) {
            return ResponseEntity.badRequest().body(new ObjectError("lot", "Lot not found."));
        }

        if(!lot.isVacant()) {
            lotService.setVacant(lot);
            return ResponseEntity.ok(lot);
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ObjectError("lot", "Lot already vacant."));
        }
    }

    @RequestMapping(value = "/findByParkingAndNumber", method = RequestMethod.GET)
    public ResponseEntity<?> searchByParkingAndNumber(@RequestParam(value = "parkingId") Long parkingId,
                                                      @RequestParam(value = "lotNumber") int lotNumber) {
        if(parkingService.findById(parkingId) == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Parking with id " + parkingId + " not found!");
        }
        Lot lot = lotService.findByParkingAndNumber(parkingId, lotNumber);
        if(lot == null) {
            return ResponseEntity.ok(null);
        }
        return ResponseEntity.ok(lot);
    }
}
