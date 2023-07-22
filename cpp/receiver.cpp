#include <iostream>
#include <winsock2.h>
#include <ws2tcpip.h>

#pragma comment(lib, "ws2_32.lib") // Link with ws2_32.lib

void printLastError(const char* msg) {
    int errCode = WSAGetLastError();
    std::cerr << msg << " Error code: " << errCode << std::endl;
}

int main() {
    WSADATA wsaData;
    SOCKET RecvSocket;
    char RecvBuf[1024];
    int BufLen = 1024;
    sockaddr_in6 SenderAddr;
    int SenderAddrSize = sizeof(SenderAddr);
    const char *MulticastIP = "ff0e::b:0000";
    const char *Port = "4200";

    // Initialize Winsock
    if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) {
        printLastError("WSAStartup failed with error");
        return 1;
    }

    struct addrinfo hints, *res;
    ZeroMemory(&hints, sizeof(hints));
    hints.ai_family = AF_INET6;
    hints.ai_socktype = SOCK_DGRAM;
    hints.ai_protocol = IPPROTO_UDP;
    hints.ai_flags = AI_PASSIVE;

    // Resolve the local address and port to be used by the server
    if (getaddrinfo(NULL, Port, &hints, &res) != 0) {
        printLastError("getaddrinfo failed with error");
        WSACleanup();
        return 1;
    }

    // Create a receiver socket
    RecvSocket = socket(res->ai_family, res->ai_socktype, res->ai_protocol);
    if (RecvSocket == INVALID_SOCKET) {
        printLastError("Socket creation failed with error");
        freeaddrinfo(res);
        WSACleanup();
        return 1;
    }

    // Bind the receiver socket
    if (bind(RecvSocket, res->ai_addr, res->ai_addrlen) == SOCKET_ERROR) {
        printLastError("Bind failed with error");
        freeaddrinfo(res);
        closesocket(RecvSocket);
        WSACleanup();
        return 1;
    }

    freeaddrinfo(res); // No longer need the address info

    // Join the multicast group
    struct ipv6_mreq mreq;
    inet_pton(AF_INET6, MulticastIP, &(mreq.ipv6mr_multiaddr));
    mreq.ipv6mr_interface = 0; // Let the system choose the interface

    if (setsockopt(RecvSocket, IPPROTO_IPV6, IPV6_ADD_MEMBERSHIP, (char *) &mreq, sizeof(mreq)) == SOCKET_ERROR) {
        printLastError("Setsockopt failed with error");
        closesocket(RecvSocket);
        WSACleanup();
        return 1;
    }

    std::cout << "Successfully joined multicast group!" << std::endl;

    // Now just loop indefinitely, reading data from the socket
    while (1) {
        int ByteReceived = recvfrom(RecvSocket, RecvBuf, BufLen, 0, (SOCKADDR *) &SenderAddr, &SenderAddrSize);
        if (ByteReceived == SOCKET_ERROR) {
            printLastError("Recvfrom failed with error");
        } else {
            RecvBuf[ByteReceived] = '\0'; // Null-terminate the string
            std::cout << "Received " << ByteReceived << " bytes: " << RecvBuf << std::endl;
        }
    }

    // When done, cleanup Winsock, and close the socket
    WSACleanup();
    closesocket(RecvSocket);

    return 0;
}

