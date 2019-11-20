class Users {
    constructor($root) {
        this.$root = $root;
        this.$button = this.$root.find('[data-users-load]');
        this.$container = this.$root.find('[data-container]');
        this.$searchInput = this.$root.find('[data-search]');
        this.$sort = this.$root.find('[data-sort]');

        this.loadUsers();
    }

    loadUsers() {
        this.$button.on('click', () => {
            this.preloader(true)

            fetch(`https://randomuser.me/api/?results=${this.getRandom(0, 100)}`).then(response => response.json()).then(response => {
                this.array = response.results;
                console.log('this.array', this.array)

                setTimeout(() => {
                    this.preloader(false, `load-end`)
                    this.initGrid(this.array);
                    this.$root.removeClass('_hide');
                    this.initFilter();
                }, 1000)
            }).catch(() => this.preloader(false, `error`));
        })
    }

    getRandom(min, max) {
        let random;
        if (min || max) {
            random = Math.floor(Math.random() * (max - min) + min);
        } else {
            random = Math.floor(Math.random() * 100);
        }
        return random;
    }

    preloader(state, type) {
        if (state) {
            this.$button.addClass('load');
        } else {
            this.$button.addClass(type);
        }
    }

    initGrid(array) {
        let arrayGrid = [];
        let template = '';

        let arrayNat = [];
        let arrayNatLenght = [];
        let templateNat = '';
        let indexNat = 0;
        
        this.arrayMan = [];
        this.arrayWoman = [];

        array.forEach((element) => {
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
                                        Date of Birth - ${new Date(element.dob.date).toLocaleDateString()}
                                    </div>
                                    <div class='user__info'>
                                        Date of Registered - ${new Date(element.registered.date).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        `;

            this.setGender(element);

            if (!arrayNat.includes(element.nat)) {
                arrayNat.push(element.nat);
                arrayNatLenght = array.filter(item => item.nat === element.nat);
                templateNat += `<div class='users-stats'>Nationality ${arrayNat[indexNat++] + ` - ` + arrayNatLenght.length}</div>`;
            }
        });

        let compareGender;
        if (this.arrayMan.length === this.arrayWoman.length) {
            compareGender = `Men and women is equal`;
        } else if (this.arrayMan.length > this.arrayWoman.length) {
            compareGender = `More men`;
        } else if (this.arrayMan.length < this.arrayWoman.length) {
            compareGender = `More woman`;
        }

        let templateStats = `
                            <div class='users-stats'>All users - ${array.length}</div>
                            <div class='users-stats'>Man - ${this.arrayMan.length}</div>
                            <div class='users-stats'>Women - ${this.arrayWoman.length}</div>
                            <div class='users-stats'>${compareGender}</div>
                        `;

        arrayGrid.push(template);
        arrayGrid.push(templateStats);
        arrayGrid.push(templateNat);

        this.$container.html(arrayGrid.join(''));        
    }

    setGender(element) {
        if (element.gender === 'male') {
            this.arrayMan.push(element);
        } else if (element.gender === 'female') {
            this.arrayWoman.push(element)
        }
    }

    initFilter() {
        this.initSearch();
        this.initSort(this.array);
    }

    initSearch() {
        let clearSearchHandler;

        this.$searchInput.on('keyup', (e) => {
            clearTimeout(clearSearchHandler);

            clearSearchHandler = setTimeout(() => {
                this.newArray = this.array.filter(item => {
                    return this.searchConfig(
                        item.name.first, 
                        item.name.last, 
                        item.phone, 
                        item.email).toLowerCase().includes(e.target.value.toLowerCase());
                });

                this.initGrid(this.newArray);
            }, 400);
        });
    }

    searchConfig(...elments) {
        return elments.join(' ');
    }

    initSort(array) {
        this.sortState = false;
        this.newArray = array;

        this.$sort.on('click', () => {
            if (!this.sortState) {
                this.sortState = true

                this.$sort.addClass('active');
                this.newArray = array.sort((a,b) => {
                    return a.name.first.localeCompare(b.name.first);
                });
                this.initGrid(this.newArray);
            } else {
                this.sortState = false

                this.$sort.removeClass('active');
                this.newArray = array.sort((a,b) => {
                    return b.name.first.localeCompare(a.name.first);
                });
                this.initGrid(this.newArray);
            }
        });
    }

}

new Users($('.root'));
