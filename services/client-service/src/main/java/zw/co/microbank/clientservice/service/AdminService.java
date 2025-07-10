package zw.co.microbank.clientservice.service;

import zw.co.microbank.clientservice.dto.ClientResponse;

import java.util.List;

/**
 * Author: tjc
 * Created on 7/10/25
 */

public interface AdminService {
//    Admin blacklist the client
    ClientResponse blacklistClient(String clientId);

//    Admin unblacklist the client
    ClientResponse unBlacklistClient(String clientId);

//    Admin Get All client
    List<ClientResponse> getAllClients();



}
