class Users {
    constructor($root) {
        this.$button = $root.find('[data-users-load]');
        this.$container = $root.find('[data-container]');
        this.$searchInput = $root.find('[data-search]');

        this.loadUsers();
    }

    loadUsers() {
        this.$button.on('click', () => {
            this.preloader(true)

            fetch(`https://randomuser.me/api/?results=${Math.floor(Math.random() * 5)}`).then(response => response.json()).then(response => {
                this.array = response.results;
                setTimeout(() => {
                    this.preloader(false)
                    this.initGrid(this.array);
                    this.initFilter();
                }, 1000)
            });
        })
    }

    preloader(state, type) {
        if (state) {
            this.$button.addClass('load');
        } else {
            this.$button.addClass('load-end');
        }
    }

    initGrid(array) {
        let arrayGrid = [];
        let template = '';

        let arrayMan = [];
        let arrayWoman = [];

        let arrayNat = [];
        let arrayNatLenght = [];
        let templateNat = '';
        let indexNat = 0;

        array.forEach((element, i) => {
            template += `
                            <div class='user'>
                                <div class='user__img'>
                                    <img src='${element.picture.large}'>
                                </div>
                                <div class='user__info-block'>
                                    <div class='user__info'>
                                        ${element.name.title}
                                        ${element.name.first}
                                        ${element.name.last}
                                        ${element.gender}
                                    </div>
                                    <div class='user__info'>
                                        ${element.phone}
                                    </div>
                                    <div class='user__info'>
                                        ${element.email}
                                    </div>
                                    <div class='user__info'>
                                        ${element.location.state}
                                        ${element.location.city}
                                        ${element.location.street.name}
                                        ${element.location.street.number}
                                    </div>
                                    <div class='user__info'>
                                        ${new Date(element.dob.date).toLocaleDateString()}
                                    </div>
                                    <div class='user__info'>
                                        ${new Date(element.registered.date).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        `;


            if (element.gender === 'male') {
                arrayMan.push(element);
            } else if (element.gender === 'female') {
                arrayWoman.push(element)
            }

            if (!arrayNat.includes(element.nat)) {
                arrayNat.push(element.nat);
                arrayNatLenght = array.filter(item => item.nat === element.nat);
                templateNat += `<div class='users-stats'>${arrayNat[indexNat++] + ` ` + arrayNatLenght.length}</div>`;
            }

        });

        let compareGender;
        if (arrayMan.length === arrayWoman.length) {
            compareGender = `Men and women is equal`;
        } else if (arrayMan.length > arrayWoman.length) {
            compareGender = `More men`;
        } else if (arrayMan.length < arrayWoman.length) {
            compareGender = `More woman`;
        }

        let templateStats = `
                            <div class='users-stats'>All users - ${array.length}</div>
                            <div class='users-stats'>Man - ${arrayMan.length}</div>
                            <div class='users-stats'>Woman - ${arrayWoman.length}</div>
                            <div class='users-stats'>${compareGender}</div>
                        `;

        arrayGrid.push(template);
        arrayGrid.push(templateStats);
        arrayGrid.push(templateNat);

        this.$container.html(arrayGrid.join(''));        
    }

    initFilter() {
        this.$searchInput.on('keypress', () => {
            this.newArray = [];

            this.array.forEach(item => {
                if (!item.name.first.indexOf(this.$searchInput.val())) {
                    this.newArray.push(item);
                    return;
                }
            })
            this.initGrid(this.newArray);
        })
    }

}

new Users($('.root'));
