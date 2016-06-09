var alreadyAttacked = false;
var bonnieRooms = [];
var camPos = new Array();
camPos[0]= {
    image01: new Image(),
    src: "/resources/img/19a.gif"    
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
 
var hour = 0;
var jumpReady = false;
var leftDoor = false;
var night = 0;
var power = 100;
var powerOutAttacked = false;
var powerUsage = 1;
var rightDoor = false;
var runStage;
var time = 0;
var order;
var rooms= [];
    
    
function playerWins() {
        
}
    
function fuzz() {
        
}
    
function westDoor() {
        
}
    
function eastLightDoor() {
        
}

function cameraState() {
    if (location.pathname === '/camera.html') {
        return true; // toggle-camera
    } else {
        return false; 
    }
}
    
function bonnieScare() {
        
}
    
function bonnieAttackIfClosed() {
        
}
    
function bonnieConstantAttack() {
        
}
    
function disableBonnie() {
        
}
    
function disableButtons() {
        
}
    
function death() {
        
}
    
function freddyAttackIfClosed() {
        
}
    
function freddyConstantAttack() {
        
}
    
function menu() {
    powerOutAttacked = false;
    alreadyAttacked = false;
    rightDoor = true;
    leftDoor = true;
}
    
function removeDoors() {
        
}
    
function powerOutFreddy() {
        
} 
    

$('document').ready(function() {
    console.log('DOM is loaded...');
    $('#start-game').on('click', function() {
        
    }),
        
    $('.left-light a').click(function() {
        $('.left-light img').toggle();
    }),
    
    $('#cam1a').click(function() {
        console.log('clicked')
        $('#camera-menu').css('backgroundImage', 'url(' + camPos[0].src + ')');
    }),
        
    $('#cam1b').click(function() {
        console.log('clicked')
        $('#camera-menu').css('backgroundImage', 'url(' + camPos[1].src + ')');
    }),
    $('#cam1c').click(function() {
        console.log('clicked')
        $('#camera-menu').css('backgroundImage', 'url(' + camPos[2].src + ')');
    }),
    $('#cam2a').click(function() {
        console.log('clicked')
        $('#camera-menu').css('backgroundImage', 'url(' + camPos[3].src + ')');
    }),
    $('#cam2b').click(function() {
        console.log('clicked')
        $('#camera-menu').css('backgroundImage', 'url(' + camPos[4].src + ')');
    }),
    $('#cam3').click(function() {
        console.log('clicked')
        $('#camera-menu').css('backgroundImage', 'url(' + camPos[5].src + ')');
    }),
    $('#cam4a').click(function() {
        console.log('clicked')
        $('#camera-menu').css('backgroundImage', 'url(' + camPos[6].src + ')');
    }),
    $('#cam4b').click(function() {
        console.log('clicked')
        $('#camera-menu').css('backgroundImage', 'url(' + camPos[7].src + ')');
    }),
    $('#cam5').click(function() {
        console.log('clicked')
        $('#camera-menu').css('backgroundImage', 'url(' + camPos[8].src + ')');
    }),
    $('#cam6').click(function() {
        console.log('clicked')
        $('#camera-menu').css('backgroundImage', 'url(' + camPos[9].src + ')');
    })
    $('#cam7').click(function() {
        console.log('clicked')
        $('#camera-menu').css('backgroundImage', 'url(' + camPos[10].src + ')');
    })
    
});

    

    
        




