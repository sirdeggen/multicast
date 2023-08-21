package main

import (
	"flag"
	"log"
	"net"
	"net/http"
	"strings"
	"time"
)

func main() {
	var multicastAddress string
	var httpsEndpoint string

	// Define command line flags
	flag.StringVar(&multicastAddress, "multicast", "", "Multicast group address")
	flag.StringVar(&httpsEndpoint, "endpoint", "", "HTTPS endpoint URL")
	flag.Parse()

	if multicastAddress == "" || httpsEndpoint == "" {
		log.Fatal("Multicast address and HTTPS endpoint are required")
	}

	// Specify the network interface by name (replace "eth0" with your interface name)
	iface, err := net.InterfaceByName("en0")
	if err != nil {
		log.Fatalf("Failed to get network interface: %v", err)
	}

	addr, err := net.ResolveUDPAddr("udp6", multicastAddress)
	if err != nil {
		log.Fatalf("Failed to resolve UDP address: %v", err)
	}

	conn, err := net.ListenMulticastUDP("udp6", iface, addr)
	if err != nil {
		log.Fatalf("Failed to listen on multicast address: %v", err)
	}

	// Set the read deadline to maintain perpetual connection
	_ = conn.SetReadDeadline(time.Time{})

	buffer := make([]byte, 1024)
	for {
		// Read from the multicast connection
		read, src, err := conn.ReadFromUDP(buffer)
		if err != nil {
			log.Fatalf("Failed to read from the multicast connection: %v", err)
		}

		// Relay this data to the HTTPS endpoint
		data := strings.NewReader(string(buffer[:read]))
		resp, err := http.Post(httpsEndpoint, "text/plain", data)
		if err != nil {
			log.Fatalf("Failed to POST to HTTPS endpoint: %v", err)
		}

		// We are not doing anything with the response for now, so close it
		defer resp.Body.Close()

		log.Printf("Received message from %s and relayed to HTTPS endpoint", src.String())
	}
}
