(function() {
// menu side bar
const menu = document.getElementById("header");

// open menu
const menuButton = document.querySelector('.menu-top i');

/* Menu funcionality
 * open / close
 */

const openMenu = () => {
    menuButton.classList.remove('close-menu-load');
    menuButton.classList.remove('fa-bars');
    menuButton.classList.add('fa-times');
    menu.classList.remove('close-menu');
    menu.classList.add('open-menu');   
    Cookies.set('menu', true);
};

const closeMenu = () => {
    menuButton.classList.remove('open-menu-load');
    menuButton.classList.remove('fa-times');
    menuButton.classList.add('fa-bars');    
    menu.classList.remove('open-menu');
    menu.classList.add('close-menu');    
    Cookies.set('menu', false);
};

// open close menu
const activateMenu = () => {
    menuButton.classList.contains('fa-bars')? openMenu(): closeMenu();
};

menuButton.addEventListener('click', activateMenu);


if(!Cookies.get('submenus')) {
    Cookies.set('submenus', JSON.stringify(layout));
}

/* user profile button */
const userProfileButton = document.getElementById('userProfile');
// user menu options
const userMenuOptions = document.querySelector('.userOptions');

const isVisibleMenu = {
    isVisible: false
};

// show hide user menu
const showHideMenu = () => {
    if(isVisibleMenu.isVisible) {
        userMenuOptions.style.display = 'none';
        isVisibleMenu.isVisible = false;
    } else {
        userMenuOptions.style.display = 'block';
        isVisibleMenu.isVisible = true;        
    }
};

if(userProfileButton) {
    userProfileButton.addEventListener('click', showHideMenu);
}
})();

function showPreview(htmlContent) {
    const body = document.querySelector('body');
    const overlay = Elem('div').class('overlay').build();
    const preview = Elem('div').class('preview').html(htmlContent).build();
    overlay.append(preview);
    document.querySelector('html').style.overflow = 'hidden';
    body.prepend(overlay);
}


const removeOverlay = (overlay) => {
    overlay.remove();
    document.querySelector('html').style.overflowY = 'scroll';
};


/* menu panel submenu behaviour */
// arrow icon
const arrows = document.getElementsByClassName('catArrow');
if(arrows) {
    [...arrows].forEach((arrow) => {
        arrow.addEventListener('click', showHideSubMenu);
    });
}    

function showHideSubMenu() {
    if(this.classList.contains('rotateArrow')) {
        this.classList.add('arrowNormal');
        this.classList.remove('rotateArrow');
        this.parentElement.querySelector('ul').style.display = 'block';
        submenuCookie('add', this.dataset.cat);
    } else {
        this.classList.remove('arrowNormal');
        this.classList.add('rotateArrow');  
        this.parentElement.querySelector('ul').style.display = 'none';
        submenuCookie('remove', this.dataset.cat);
    }
}

function submenuCookie(type, id) {

    let submenusList;

    if(Cookies.get('showHideSubMenus')) {
        submenusList = JSON.parse(Cookies.get('showHideSubMenus'));
    } else {
        submenusList = [];
    }

    if(type === 'add') {

        if(submenusList.includes(id)) {
            return;
        }
        submenusList.push(id);
        Cookies.set('showHideSubMenus', JSON.stringify(submenusList));
    } else {
        for(let i = 0; i < submenusList.length; i++) {
            if(submenusList[i] === id) {
                submenusList.splice(i, 1);
            }
            Cookies.set('showHideSubMenus', JSON.stringify(submenusList));
        }
    }
    
}
