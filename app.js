class Users {
    constructor($root) {
        this.$button = $root.find('[data-users-load]');
        this.$container = $root.find('[data-users-container]');
        this.$element = this.$container.find('[data-users-elem]');
        this.$userStats = $root.find('[data-users-stats]');
        this.$searchInput = $root.find('[data-search]');

        this.arrayNat = [];

        this.loadUsers();
    }

    loadUsers() {
        this.$button.on('click', () => {
            const randomNumber = Math.floor(Math.random() * 10) + 1;
            this.preloader(true)

            $.ajax({
                url: `https://randomuser.me/api/?results=${randomNumber}`,
                dataType: 'json',
                success: (response) => {
                    this.preloader(false)
                    console.log(response.results);
                    // this.$elementImg.attr('src', response.results[0].picture.medium);
                    this.array = response.results;
                    this.initGrid();
                }
            });
        })
    }

    preloader(type) {
        if (type) {
            this.$container.addClass('load');
        } else {
            this.$container.removeClass('load');
        }
    }

    initGrid() {
        this.array.forEach((element, i) => {

            this.template = `<div class='users__item'>
            <div class='users__img'>
                <img src='${element.picture.large}'>
            </div>
                <div class='users__info-block'>
                    <div class='users__info'>
                        ${element.name.title}
                        ${element.name.first}
                        ${element.name.last}
                        ${element.gender}
                    </div>
                    <div class='users__info'>
                        ${element.phone}
                    </div>
                    <div class='users__info'>
                        ${element.email}
                    </div>
                    <div class='users__info'>
                        ${element.location.state}
                        ${element.location.city}
                        ${element.location.street.name}
                        ${element.location.street.number}
                    </div>
                    <div class='users__info'>
                        ${element.dob.date}
                        ${element.registered.date}
                    </div>
                </div>
            </div>`;
            this.$container.append(this.template);

            this.arrayNat.push(this.arrayNat.includes(element.nat) ? false : element.nat);

            this.arrayNatLenght = this.array.filter(item => item.nat === element.nat);
        
            this.templateNat = `<div class='users-stats__text'>${this.arrayNat[i] + this.arrayNatLenght.length}</div>`

            this.$userStats.append(this.arrayNat[i] ? this.templateNat : null);
        });

        this.arrayMan = this.array.filter(item => item.gender === 'male');
        this.arrayWoman = this.array.filter(item => item.gender === 'female');
        this.arrayTelegram = this.array.filter(item => item.login.username);


        this.templateStats = `<div class='users-stats'>
            <div class='users-stats__text'>All users ${this.array.length}</div>
            <div class='users-stats__text'>Man ${this.arrayMan.length}</div>
            <div class='users-stats__text'>Woman ${this.arrayWoman.length}</div>
            <div class='users-stats__text'> ${ this.arrayMan.length > this.arrayWoman.length ? 'Man': 'Woman' }</div>
            <div class='users-stats__text'>Telegram ${this.arrayTelegram.length}</div>
        </div>`;

        this.$container.append(this.templateStats);
        
        this.initFilter();
    }

    initFilter() {
        this.$searchInput.on('keyup', () => {
            this.newArray = [];

            this.array.forEach(item => {
                if (!item.name.first.indexOf(this.$searchInput.val())) {
                    this.newArray.push(item);
                    return;
                }
            })
            this.newArray;
            this.initGrid();
        })
    }

}

new Users($('body'));
