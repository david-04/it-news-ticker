TOP=11
BOTTOM=5

autorun: $(foreach INDEX, 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15, favicon.$(INDEX).png);
	rm favicon.tmp.top.png favicon.tmp.bottom.png
	magick -delay 10 -loop 0 $^ preview.gif

favicon.%.png: favicon.tmp.top.png favicon.tmp.bottom.png
	magick favicon.tmp.bottom.png -crop 16x0+$*+0 favicon.$*.png
	magick favicon.tmp.top.png favicon.$*.png -append favicon.$*.png

favicon.tmp.top.png: favicon.png
	magick favicon.png -crop 16x$(TOP)+0+0 favicon.tmp.top.png

favicon.tmp.bottom.png: favicon.png
	magick favicon.png -crop 16x$(BOTTOM)+0+$(TOP) favicon.tmp.bottom.png
	magick favicon.tmp.bottom.png favicon.tmp.bottom.png +append favicon.tmp.bottom.png
