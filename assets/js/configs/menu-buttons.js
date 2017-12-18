const MenuButtons = [
    {
        attrs: {
            'data-section': 'game',
            href: '/game',
        },
        text: 'Start',
        classes: ['button', 'menu-button'],
    },

    {
        attrs: {
            'data-section': 'about',
            href: '/about',
        },
        text: 'About',
        classes: ['button', 'menu-button'],
    },
    {
        attrs: {
            'data-section': 'settings',
            href: '/settings',
        },
        text: 'Settings',
        classes: ['button', 'menu-button'],
    },
    {
        attrs: {
            'data-section': 'scoreboard',
            href: '/scoreboard',
        },
        text: 'Scores',
        classes: ['button', 'menu-button'],
    },
    {
        attrs: {
            'data-section': 'logout',
            href: '/logout',
        },
        text: 'Logout',
        classes: ['button', 'menu-button'],
    },
];

export default MenuButtons;
