local hudAngle=0
local defaultStrumPos = {}
function onCreate()
	makeAnimatedLuaSprite('eat','characters/fever/fever_eat',645,-110)
	addAnimationByPrefix('eat',"eat", "Fever eat")
	addLuaSprite('eat')
	setProperty('eat.visible',false)
end

function onCreatePost()
    setProperty('playbackRate',1.25)
    for i = 0,3 do table.insert(defaultStrumPos,_G['defaultOpponentStrumX'..i]) end
    for i = 0,3 do table.insert(defaultStrumPos,_G['defaultPlayerStrumX'..i]) end
	setObjectOrder('eat', getObjectOrder('boyfriendGroup'))
end

function onBeatHit()
	if (curBeat < 276) then
		if (curBeat >= 8 and curBeat < 136 and curBeat % 2 == 0) then
			setProperty('camHUD.zoom',getProperty('camHUD.zoom')+(curBeat%4==0 or 0.015 and 0.005))
		end
	elseif (curBeat >= 276 and curBeat < 340) then
		if (curBeat % 2 == 0) then
			if curBeat%4==0 then setProperty('camHUD.zoom',getProperty('camHUD.zoom')+0.018) else 
				setProperty('camHUD.zoom',getProperty('camHUD.zoom')+0.009) end
			if curBeat%4==0 then hudAngle=0.65 else hudAngle=0.005 end
		end
	elseif (curBeat >= 340 and curBeat < 404) then
		hudAngle = 0;
		setProperty('camHUD.zoom',getProperty('camHUD.zoom')+0.015)
	elseif (curBeat >= 404 and curBeat < 468) then
		if (curBeat % 3 == 0) then
			setProperty('camHUD.zoom',getProperty('camHUD.zoom')+0.02)
		end
	end
end

function onStepHit()
	if (curStep == 1) then
		showBubble("robo-fever")
	end

	if (curStep == 1073) then
		showBubble("scarlet")
	end

	if (curStep == 10)  then
		runHaxeCode([[
			getVar('arm').playAnim('phone');
			game.dad.playAnim('phone');
            game.dad.specialAnim = true;

			getVar('arm').animation.finishCallback = function(a)
			{
				if (a == "phone")
				{
					game.getLuaObject('wheel',false).visible = true;
				}
			}
		]])
	end

	if (curStep == 34) then
		setIcon('robo-cesar')
		setHealthBarColors('9236B4',getBfColor())
	end

	if (curStep == 546 or curStep == 548 or curStep == 605 or curStep == 607 or curStep == 610 or curStep == 612 or curStep == 669 or curStep == 671
		or curStep == 674 or curStep == 676 or curStep == 733 or curStep == 735 or curStep == 738 or curStep == 740) then
			setProperty('camGame.zoom',getProperty('camHUD.zoom')+0.02)
			setProperty('camHUD.zoom',getProperty('camHUD.zoom')+0.016)
        for i = 0,7 do
            local nextX,plus = defaultStrumPos[i+1],0
			if (curStep == 546 or curStep == 548) then
				if (i < 2 or i < 6 and i > 3) then if (i == 0 or i == 4) then plus = -35 else plus = -15 end else if (i == 3 or i == 7) then plus = 35 else plus = 15 end end
			else
				if (i < 2 or i < 6 and i > 3) then if (i == 0 or i == 4) then plus = -10 else plus = -5 end else if (i == 3 or i == 7) then plus = 10 else plus = 5 end end
			end
			nextX=nextX+plus
            doTweenX('strumLineNotes'..i, 'strumLineNotes.members['..i..']', nextX, 0.1)
            --tween(strumLineNotes[i], {x: nextX}, 0.1)
        end
	end

	if (curStep == 1064) then
		setProperty('health', 1)
		local dadColor=getProperty('dad.healthColorArray')
		setHealthBarColors(getColorFromRGB(dadColor[1],dadColor[2],dadColor[3],false), getBfColor())
		runHaxeCode('game.iconP2.changeIcon("icon-rolldog");')
		runHaxeCode([[
			game.boyfriend.playAnim('phone',true,true);
			game.boyfriend.specialAnim = true;

			getVar('arm').playAnim('phone',true,true);
			game.getLuaObject('wheel',false).visible=false;
		]])
	end

	if (curStep == 1080) then
		runHaxeCode([[
			game.boyfriend.playAnim('phone',true);
			game.boyfriend.specialAnim = true;
			
			getVar('arm').playAnim('phone',true);
		]])
	end

	if (curStep == 1106) then
		setIcon('scarlet')
		setHealthBarColors('E059B1',getBfColor())
	end
	
	if (curStep == 1881) then
		setProperty('health', 1)
		local dadColor=getProperty('dad.healthColorArray')
		setHealthBarColors(getColorFromRGB(dadColor[1],dadColor[2],dadColor[3],false), getBfColor())
		runHaxeCode('game.iconP2.changeIcon("icon-rolldog");')
		runHaxeCode([[
			game.boyfriend.playAnim('phone',true,true);
			game.boyfriend.specialAnim = true;

			getVar('arm').playAnim('phone',true,true);
			game.getLuaObject('wheel',false).visible=false;
		]])
	end

	if (curStep == 2152) then
		setProperty('eat.visible',true)
		setProperty('boyfriend.visible',false)
		playAnim('eat','eat',true)
	end
end

function onUpdate(elapsed)
	if (curStep >= 1064 and curStep < 1079 or curStep >= 1881) then
		if (runHaxeCode('if (getVar("arm").animation.name == "phone" && getVar("arm").animation.curAnim.curFrame == 0) return true; else return false;'))then
			setProperty('wheel.visible',false)
			runHaxeCode('getVar("arm").playAnim("wheel",true);')
		end
	end

    for i = 0,7 do
        setPropertyFromGroup('strumLineNotes', i, 'x', (defaultStrumPos[i+1] + (1 - (elapsed * 3.125)) * (getPropertyFromGroup('strumLineNotes', i, 'x') - defaultStrumPos[i+1])))
    end

	addHaxeLibrary('FlxMath','flixel.math')
	runHaxeCode('game.camHUD.angle = FlxMath.lerp('..hudAngle..', game.camHUD.angle, FlxMath.bound(1 - ('..elapsed..' * 25.125), 0, 1));')
end

function goodNoteHit(noteIndex, noteData, noteType, isSustainNote)
	if (curStep >= 416 and curStep <= 420) then
		setProperty('camGame.zoom',getProperty)('camGame.zoom'+0.02)
	end
end

function getColorFromRGB(RR,GG,BB,PassFromHex)
    local FinalColor,RGBNum='',{"0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"}
    if RR==nil then RR="00" end
    if GG==nil then GG="00" end
    if BB==nil then BB="00" end
    if RR>255 then RR="255" end
    if GG>255 then GG="255" end
    if BB>255 then BB="255" end
    local RGB={RR,GG,BB}
    for i=1,#RGB do FinalColor=FinalColor..RGBNum[math.floor(RGB[i]/16)+1]..RGBNum[(RGB[i]%16)+1] end
    if PassFromHex then return getColorFromHex(FinalColor) else return FinalColor end
end

function getBfColor()
	local bfColor=getProperty('boyfriend.healthColorArray')
	return getColorFromRGB(bfColor[1],bfColor[2],bfColor[3],false)
end

function setIcon(chara)
	runHaxeCode('game.iconP2.changeIcon("roll-dog-icons/icon-'..chara..'");')
end

function showBubble(icon)
    setProperty('bubble.visible', true)
    playAnim('bubble', 'appear', true, false, 0)
    
    makeAnimatedLuaSprite('bubbleIcon', "rolldog/icons/"..icon, gP('bubble.x') + (gP('bubble.width') /2), gP('bubble.y') + ((gP('bubble.height') - 90) /2))
    addAnimationByPrefix('bubbleIcon', 'idle', icon, 24, true)
    playAnim('bubbleIcon', 'idle', true, false, 0)
    setObjectOrder('bubbleIcon',getObjectOrder('bubble')+1)
    setProperty('bubbleIcon.antialiasing', true)
    setProperty('bubbleIcon.visible', false)
    setProperty('bubbleIcon.x', gP('bubbleIcon.x')-(gP('bubbleIcon.width')/2))
    setProperty('bubbleIcon.y', gP('bubbleIcon.y')-(gP('bubbleIcon.height')/2))
    if (icon == "mega" or icon == "flippy") then
        setProperty('bubbleIcon.antialiasing', false)
        setProperty('bubbleIcon.scale.x', 4.9)
        setProperty('bubbleIcon.scale.y', 4.9)
    end
    addLuaSprite('bubbleIcon', true)
end

function gP(v) return getProperty(v) end