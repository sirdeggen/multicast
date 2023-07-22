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
    SOCKET SendSocket;
    const char *SendBuf = "Hello, Multicast!";
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
    hints.ai_flags = 0;

    // Resolve the server address and port
    if (getaddrinfo(MulticastIP, Port, &hints, &res) != 0) {
        printLastError("getaddrinfo failed with error");
        WSACleanup();
        return 1;
    }

    // Create a sender socket
    SendSocket = socket(res->ai_family, res->ai_socktype, res->ai_protocol);
    if (SendSocket == INVALID_SOCKET) {
        printLastError("Socket creation failed with error");
        freeaddrinfo(res);
        WSACleanup();
        return 1;
    }

    // Send a datagram to the receiver
    if (sendto(SendSocket, SendBuf, strlen(SendBuf), 0, res->ai_addr, res->ai_addrlen) == SOCKET_ERROR) {
        printLastError("Sendto failed with error");
        freeaddrinfo(res);
        closesocket(SendSocket);
        WSACleanup();
        return 1;
    }

    freeaddrinfo(res); // No longer need the address info

    std::cout << "Data sent!" << std::endl;

    // When done, cleanup Winsock, and close the socket
    WSACleanup();
    closesocket(SendSocket);

    return 0;
}

