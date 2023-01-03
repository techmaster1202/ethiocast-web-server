var keyboardOpen = false;
function startMouseEvents(){
    // $('div[data-focusable]').hover(    
    //     function () {
    //         console.log('focus')
    //         // if(jQuery(this).find("input").length > 0){
    //         //     keyboardOpen = true;
    //         //     jQuery(this).find("input").focus();
    //         // }else{
    //             this.focus();
    //         // }
    //     },
    //     function (event) {
    //         console.log('blur')
    //         // if(keyboardOpen == false){
    //             // if(jQuery(this).find("input").length > 0){
    //             //     jQuery(this).find("input").blur()
    //             // }else{
    //                 this.blur();
    //             // }  
    //         // } 
    //     }
    // );
    // $('.r-lrvibr').hover(    
    //     function () {
    //         // if(jQuery(this).find("input").length > 0){
    //         //     keyboardOpen = true;
    //         //     jQuery(this).find("input").focus();
    //         // }else{
    //             this.focus();
    //         //}
    //     },
    //     function (event) {
    //         // if(keyboardOpen == false){
    //         //     if(jQuery(this).find("input").length > 0){
    //         //         jQuery(this).find("input").blur()
    //         //     }else{
    //                 this.blur();
    //         //     }  
    //         // } 
    //     }
    // );
    window.addEventListener('native.showkeyboard', function(){
        keyboardOpen = true;
    });

    window.addEventListener('native.hidekeyboard', function(){
        keyboardOpen = false;
    });


}
//$(function() {
    // $('div[data-focusable]').hover(    
    //     function () {
    //         console.log('focus')
    //         // if(jQuery(this).find("input").length > 0){
    //         //     keyboardOpen = true;
    //         //     jQuery(this).find("input").focus();
    //         // }else{
    //             this.focus();
    //         // }
    //     },
    //     function (event) {
    //         console.log('blur')
    //         // if(keyboardOpen == false){
    //             // if(jQuery(this).find("input").length > 0){
    //             //     jQuery(this).find("input").blur()
    //             // }else{
    //                 this.blur();
    //             // }  
    //         // } 
    //     }
    // );
    // $(".r-userSelect-lrvibr").hover(function() {
    //     $(this).css("background-color","red")
    // });
//})