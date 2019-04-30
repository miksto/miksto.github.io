# Background

After moving to Japan, a country with about 10 earthquakes per day, I could not help but
to get interested in the topic.
I frequently checked The Japan Meteorological Agency's webpage (https://www.jma.go.jp/en/quake/) 
to stay up to date with the latest earthquakes in Japan. Most earthquakes are to distant or to weak,
so to know if what you felt was an actual earthquake or just imagination, you would have to wait for that
webage to get updated. However, I did not have the patience for that, 
and decided to build my own seismometer to be able to collect my own data, in real time.

<<Bild på seismometer, och grafer>>

Construction and software overview:
After browsing the internet for different DIY seismometers, I deciede for a vertical pendulum seismometer
based on ease of build. Specifically this page https://tc1seismometer.wordpress.com/ was a great resource for
information on the construction. As for the electronic, this page http://www.infiltec.com/seismo/ was helpful.

In essence the seismometer consists of a magnet suspended by a spring, which will move relative 
to a coil as the ground moves. When the magnet moves relative to the coil a small current is created which
by the use of an op-amp is amplified and represented as a voltage swinging from around 0 to 5 volts. This voltage
sampled by an ADC and a RaspberryPi at ~300Hz, and then in software passed through a low pass filter, with a cutoff
frequency of about 1.6Hz. The software processing is to a large extent handled by the library obspy, a python library for
seismology (https://www.obspy.org/). After the low pass filtering the signal is downsampled from 300Hz to a more suitable 15Hz
and sent to a webserver stores the data, saves plots as images, and provides an API for the web frontend.

Hårdvara
  Although the materials differ, the general construction principle of this seismometer and the TC1 seismometer
  are very much alike. The most notable difference being the tube, which I in an attempt to minimize RF noise, was chosen
  to be a metal mesh rather than an acrylic pixpe. A not of warning here, make sure the metal is NOT magnetig. The same thing goes 
  for the nuts and skrews to clamp the rolled net toghether. The mesh came in a plastic tube, which i kept on in order to prevent 
  moving air from affecting the seismometer.

  <<image of rolled net>>

  The coils is wound with a <<GAUGE>> wire around a used up tape role, with a large enough inner diameter for my neodymium magnets
  to pass trough with some margin. The desired resistance of the coil 700 ohms to 200 ohms according to the TC1 webpage.
  My coild turned out a bit short of that, with a resistance of 670 ohms, since the wire snapped while winding the coil.

  <<image of coil>>
  spole: vilken gauge, vilket motstånd

  The spring consists of a plastic spring I deemed suitable, which i found at Tokyu Hands.
  The magnets are skrewed into place on a eye bolt, and hung on the spring.

  <<image of spring and eye bolt and magnets>>

  The final part of the assemly is the dampener which is required to prevent the seismometer to be
  overly sensitive in its resonant frequency, which is determined by the spring itself and the weight the eye bolt and the magnets.
  You want the spring, when pulled and released, to return to and just barely overshoot its resting position before coming to a rest.
  <<insert source>>
  This is accomplished by a metal pipe placed below the coil, and an extra pair of magnets inserted into the metal pipe.
  A high conductivity metal like copper is a good choice, but with a limited selection I went for a alumiun pipe which also
  worked great. Perhaps thanks to its slightly higher thickness.

  <<insert image of dampener>>
  
  The coil is held into position by a circular foam pad held into place by the friction against to wall of the rolled metal mesh.
  <<imager of foam pad>>

  The metal pipe is held into place by two foam pads, one in each end.
  The spring is held into place by a piece of stiff paper, and hung from the top of the metal mesh roll.
  This could certainly be improved as even a light touch easily knocks the spring and magnets out of position.
  <<insert image of paper contraption>>

  The the coil a shielded stereo audio cable is used. The shielding is connected to the metal mesh itself, and the 
  two inner cables are attached to each end of the coil. This way, the current from the coil is passed as a differential signal, with a shielding further increasing the noise immunity.
  When trying to use a mono stereo cable, using the single internal cable and the shielding
  to pass the signal the noise level became noticably higher.

  <<insert image of coil and cable assembly>>


Elkrets
  OP-amp,

Mjukvara
  RaspberryPi
    sampling rate
    filtering
  server
    image generation
    websocket
  web frontent
    reactJs
    


