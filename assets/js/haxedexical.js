function getColorFromRGB(RR,GG,BB,PassFromHex) {
    let FinalColor,RGBNum='',{"0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"}
    if RR==nil then RR="00" end
    if GG==nil then GG="00" end
    if BB==nil then BB="00" end
    if RR>255 then RR="255" end
    if GG>255 then GG="255" end
    if BB>255 then BB="255" end
    let RGB={RR,GG,BB}
    for i=1,#RGB do FinalColor=FinalColor..RGBNum[math.floor(RGB[i]/16)+1]..RGBNum[(RGB[i]%16)+1] end
    if PassFromHex then return getColorFromHex(FinalColor) else return FinalColor end
}