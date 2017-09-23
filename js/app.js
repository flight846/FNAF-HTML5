var camPos = new Array();
camPos[0]= {
    image01: new Image(),
    src: "resources/img/rooms/1a_show_stage/cam_1a_b'+showStage[0]+'_c'+showStage[0]+'_f'+showStage[0]+'.png",
};
camPos[1]= {
    image02: new Image(),
    src: "/resources/img/48.png"
};
camPos[2]= {
    image03: new Image(),
    src: "/resources/img/66.png"
};
camPos[3]= {
    image04: new Image(),
    src: "/resources/img/43.gif"
};
camPos[4]= {
    image05: new Image(),
    src: "/resources/img/0.png"
};
camPos[5]= {
    image06: new Image(),
    src: "/resources/img/62.png"
};
camPos[6]= {
    image07: new Image(),
    src: "/resources/img/67.png"
};
camPos[7]= {
    image08: new Image(),
    src: "/resources/img/49.png"
};
camPos[8]= {
    image09: new Image(),
    src: "/resources/img/354.png"
};
camPos[9]= {
    image10: new Image(),
    src: "/resources/img/42_background.png"
};
camPos[10]= {
    image11: new Image(),
    src: "/resources/img/41.png"
};

var sounds = {
    main: "resources/audio/Buzz_Fan_Florescent2.wav",
    call: "resources/audio/voiceover1c.wav",

}

var hour = 0;
var jumpReady = false;
var leftDoor = 0;
var leftLight = 0;
var rightDoor = 0;
var rightLight = 0;
var cameraMode = 0;
var night = 1;
var power = 100;
var powerUsage = 1;
var decrementPower = 15000 / powerUsage;
var time = 1;
var order;
var rooms= [];
var showStage = [1, 1, 1];

// reset
function init() {
    night = 1;
    time = 0;
    jumpReady = false;
    powerOutAttacked = false;
    alreadyAttacked = false;
    rightDoor = 0;
    leftDoor = 0;
    // location.replace('/index.html');
}

function updateTime() {
    time++
    //console.log(time)
//    console.log(time)
}

function updatePower() {
    power--
    $('#power-counter').html(power)
}

function updateHour() {
    hour++
    console.log(time)
    $('#hour-counter').html(hour)
}

function updateGameTime() {
    var timer = setInterval(updateTime, 3000);
    var timer2 = setInterval(updatePower, decrementPower); // decrement power every 15 seconds (default)
    var timer3 = setInterval(updateHour, 120000); // 1 game hour == 2 mins
}

function updatePowerUsage() {
    $('.usage-counter img').attr('src', 'resources/img/game/batt_usage_'+powerUsage+'.png');
}

function moveBonny() {

}

function moveChika() {

}

function moveFreddy() {

}

function playerWins() {

}

function muteCall() {
    $("#call").get(0).pause();
    $('.mute-call').css('display', 'none');
}

function toggleLeftDoor() {
    leftDoor?leftDoor = 0:leftDoor = 1;
    $(".door-on").get(0).play();
    $('.left-switch > img').attr('src', 'resources/img/rooms/left_switch_door_'+leftDoor+'_light_'+leftLight+'.png');
    $('.left-door > img').attr('src', 'resources/img/doors/left_door_'+leftDoor+'.gif');
    updatePowerUsage()
}

function toggleRightDoor() {
    rightDoor?rightDoor = 0:rightDoor = 1;
    $(".door-on").get(0).play();
    $('.right-switch > img').attr('src', 'resources/img/rooms/right_switch_door_'+rightDoor+'_light_'+rightLight+'.png');
    $('.right-door > img').attr('src', 'resources/img/doors/right_door_'+rightDoor+'.gif');
    updatePowerUsage()
}

function toggleLeftLight() {
    $('#left-light-toggle').mousedown(function() {
        leftLight?leftLight = 0:leftLight = 1;
        $(".light-on").get(0).play();
        $('.left-switch > img').attr('src', 'resources/img/rooms/left_switch_door_'+leftDoor+'_light_'+leftLight+'.png');
        $('.background .main-screen').attr('src', 'resources/img/rooms/safe_room/safe_room_left_light_'+leftLight+'_right_light_'+rightLight+'.png');
        updatePowerUsage()
    })
    $('#left-light-toggle').mouseup(function() {
        leftLight?leftLight = 0:leftLight = 1;
        $(".light-on").get(0).pause();
        $('.left-switch > img').attr('src', 'resources/img/rooms/left_switch_door_'+leftDoor+'_light_'+leftLight+'.png');
        $('.background .main-screen').attr('src', 'resources/img/rooms/safe_room/safe_room_left_light_'+leftLight+'_right_light_'+rightLight+'.png');
        updatePowerUsage()
    })
}

function toggleRightLight() {
    $('#right-light-toggle').mousedown(function() {
        rightLight?rightLight = 0:rightLight = 1;
        $(".light-on").get(0).play();
        $('.right-switch > img').attr('src', 'resources/img/rooms/right_switch_door_'+rightDoor+'_light_'+rightLight+'.png');
        $('.background .main-screen').attr('src', 'resources/img/rooms/safe_room/safe_room_left_light_'+leftLight+'_right_light_'+rightLight+'.png');
        updatePowerUsage()
    })
    $('#right-light-toggle').mouseup(function() {
        rightLight?rightLight = 0:rightLight = 1;
        $(".light-on").get(0).pause();
        $('.right-switch > img').attr('src', 'resources/img/rooms/right_switch_door_'+rightDoor+'_light_'+rightLight+'.png');
        $('.background .main-screen').attr('src', 'resources/img/rooms/safe_room/safe_room_left_light_'+leftLight+'_right_light_'+rightLight+'.png');
        updatePowerUsage()
    })
}

function cameraState() {
    // if (location.pathname === '/camera.html') {
    //     return true; // toggle-camera
    // } else {
    //     return false;
    // }

}

function bonnieScare() {

}

function bonnieAttackIfClosed() {


}

function disableBonnie() {

}

// function disableButtons() {
//     $('.left-door-switch').hide();
//     $('.right-door-switch').hide();
//     $('.control').hide();
//     $('.toggle-camera').hide();
// }

function removeDoors() {

}

function powerOutAttacked() {
    if (power === 0) {
        return true
    } else {
        return false
    }
}

function powerOutFreddy() {
    if(powerOutAttacked() === true) {
        disableButtons();
        $('#main-screen').css('background-image', 'url()');
        menu();
    }
}


$('document').ready(function() {
    console.log('DOM is loaded...');
    if (location.pathname === '/main.html') {
        init();
        updateGameTime();
        toggleLeftLight();
        toggleRightLight();
        $("#game-start").get(0).play();

        $('#toggle-camera').click(function() {
            cameraMode?cameraMode = 0:cameraMode = 1;
            $('.camera-toggle').get(0).play();
            $('#camera-bg2 img').attr('src', 'resources/img/cams/camera_mode_'+cameraMode+'.gif');
            setTimeout(function() {
                $('.camera-menu').toggleClass('show');
                // $('#camera-bg2 img').css('opacity', 0);
                $('#camera-bg1 img').attr('src', 'resources/img/rooms/1a_show_stage/cam_1a_b'+showStage[0]+'_c'+showStage[0]+'_f'+showStage[0]+'.png');
            }, 600);
        })

        setTimeout(function() {
            $('.transition').addClass('animate-out');
        }, 2900);

        setTimeout(function() {
            $('.container:not(#start-screen)').css('opacity', '1');
            $('.transition').css('display', 'none');
        }, 3900);

        $('#cam1a').click(function() {
            $('#camera-bg1 img').attr('src', 'resources/img/rooms/1a_show_stage/cam_1a_b'+showStage[0]+'_c'+showStage[0]+'_f'+showStage[0]+'.png');
            $('.camera-cycle').get(0).play();
        }),

        $('#cam1b').click(function() {
            $('#camera-bg1 img').attr('src', 'resources/img/rooms/1b_dining_area/1b_b0_c0_f0.png');
            $('.camera-cycle').get(0).play();
        }),
        $('#cam1c').click(function() {
            $('#camera-bg1 img').attr('src', 'resources/img/rooms/1c_pirate_cove/1c_b0_c0_f0.png');
            $('.camera-cycle').get(0).play();
        }),
        $('#cam2a').click(function() {
            console.log('clicked')
            $('.main-screen').css('backgroundImage', 'url(' + camPos[3].src + ')');
        }),
        $('#cam2b').click(function() {
            console.log('clicked')
            $('.main-screen').css('backgroundImage', 'url(' + camPos[4].src + ')');
        }),
        $('#cam3').click(function() {
            console.log('clicked')
            $('.main-screen').css('backgroundImage', 'url(' + camPos[5].src + ')');
        }),
        $('#cam4a').click(function() {
            console.log('clicked')
            $('.main-screen').css('backgroundImage', 'url(' + camPos[6].src + ')');
        }),
        $('#cam4b').click(function() {
            console.log('clicked')
            $('.main-screen').css('backgroundImage', 'url(' + camPos[7].src + ')');
        }),
        $('#cam5').click(function() {
            $('#camera-bg1 img').attr('src', 'resources/img/rooms/5_backstage/5_b0_c0_f0.png');
            $('.camera-cycle').get(0).play();
        }),
        $('#cam6').click(function() {
            console.log('clicked')
            $('.main-screen').css('backgroundImage', 'url(' + camPos[9].src + ')');
        })
        $('#cam7').click(function() {
            console.log('clicked')
            $('.main-screen').css('backgroundImage', 'url(' + camPos[10].src + ')');
        })
    }
});
