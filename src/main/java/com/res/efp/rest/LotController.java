package com.res.efp.rest;

import com.res.efp.domain.model.Lot;
import com.res.efp.service.LotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;

/**
 * Created by gatomulesei on 2/6/2018.
 */
@RestController
@RequestMapping(value = "/api/lots")
public class LotController {

    @Autowired
    private LotService lotService;

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
}
