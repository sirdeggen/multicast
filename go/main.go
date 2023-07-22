package main

import (
	"fmt"
	"net"
	"time"

	"golang.org/x/net/ipv6"
)

func main() {
	// set up interface
	en0, err := net.InterfaceByName("en0")
	if err != nil {
		fmt.Println(err)
	}
	group := net.ParseIP("ff0e::b:0")
	fmt.Println("group", group)

	c, err := net.ListenPacket("udp6", "[::]:4201")
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("c", c)
	defer c.Close()

	packetConnection := ipv6.NewPacketConn(c)
	if err := packetConnection.JoinGroup(en0, &net.UDPAddr{IP: group, Port: 4201}); err != nil {
		fmt.Println(err)
	}

	go func(p *ipv6.PacketConn) {
		for {
			// fmt.Println("reading")
			b := make([]byte, 1500)
			n, _, src, err := p.ReadFrom(b)
			if err != nil {
				fmt.Println(err)
			}
			// if cm.Dst.IsMulticast() {
			fmt.Printf("from %v: %s\n", src, b[:n])
			// }
		}
	}(packetConnection)

	for {
		// fmt.Println("writing")
		time.Sleep(time.Second)
		data := []byte("Hello, multicast world!")
		dst := &net.UDPAddr{IP: group, Port: 4201}
		wcm := ipv6.ControlMessage{TrafficClass: 0xe0, HopLimit: 1}
		if _, err := packetConnection.WriteTo(data, &wcm, dst); err != nil {
			fmt.Println(err)
		}
	}

}
