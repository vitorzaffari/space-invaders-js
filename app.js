document.addEventListener('DOMContentLoaded', () => {


    //PROJECT//
    //the math logic used relies on the grid measures for the game, any changes to the grid ( 15x15 squares) will require modifications below
    //a lógica matemática usada aqui depende exclusivamente das medidas da grid, qualquer mudança na grid ( 15x15 quadros ) necessitará de modificações no codigo

    const squares = document.querySelectorAll('.grid div');
    const resultDisplay = document.querySelector('span'); // result will be displayed inside the span element -- resultado sera mostrado dentro da span

    let width = 15
    let currentShooterIndex = 202 // div 202 should be at the botton center of the grid -- div 202 é posicionada no centro inferior da grid
    let currentInvaderIndex = 0 // will be used to move all invaders on the 'alienInvaders' array l.16 -- usado para mover todos os invaders na array 'alienInvaders' na linha 16
    let alienInvadersTakenDown = [] // will store caught invaders -- armazenará invaders derrotados
    let result = 0 //points
    let direction = 1
    let invaderId

    //define the invaders array with positions
    //define a array com a posição inicial dos invaders
    const alienInvaders = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39
    ]

    //draw the invaders on the grid -- define a classe que mostra os invaders
    alienInvaders.forEach(invader => squares[currentInvaderIndex + invader].classList.add('invader'));

    //draw the shooter on the grid -- define a classe que mostra o shooter
    squares[currentShooterIndex].classList.add('shooter');

    //move the shooter -- função para movimentar o shooter
    function moveShooter(e) {
        //removes the shooter display at current div when function is called
        //remove o shooter na div atual quando a função for chamada
        squares[currentShooterIndex].classList.remove('shooter');

        switch (e.keyCode) {
            case 37: // 37 = left arrow key -- 37 = seta esquerda
                // if the remainder of the current shooter location with 15 (width) is different than 0 then it will receive the current index -1, thus moving the shooter to the left
                // se o resto da localição atual do shooter com 15 (largura) for diferente de 0 a localição atual recebera -1, movendo o shooter para a esquerda
                if (currentShooterIndex % width !== 0) currentShooterIndex -= 1; // the condition prevents shooter to move up or dawn - a condição previne que o shotter se move para cima ou para baixo
                break
            case 39: // 39 = right arrow key -- 37 = seta direita
                // if the remainder of the current shooter location with 15 (width) is less than 14 then it will receive the current index +1, thus moving the shooter to the right
                // se o resto da localição atual do shooter com 15 (largura) for menor que 14 a localição atual receberá +1, movendo o shooter para a direita
                if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;// the condition prevents shooter to move up or dawn - a condição previne que o shotter se move para cima ou para baixo
                break
        }
        squares[currentShooterIndex].classList.add('shooter')
        //puts the shooter back in the grid on it's new location
        //coloca o shooter de volta a grid em sua nova localização
    }

    //pressing any of the arrow keys will call this function
    //ao pressionar as teclas a função será chamada
    document.addEventListener('keydown', moveShooter);


    //move invaders -- movimentar invaders
    function moveInvaders() {
        const leftEdge = alienInvaders[0] % width === 0;
        //if the remainder of the first invader with 15 (with) is equal to 0 it means that the invaders is 
        //hitting the left edge. a boolean value is assigned to the variable
        //--se o resto do primeiro invader com 15 (largura) é igual a 0, significa que o invader esta 
        //--encostando na parede esquerda. um valor booleano é colocado na variavel
        const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
        //same concept for left edge is applied here
        //-- o mesmo conceito para a parede esquerda é aplicado para a direita

        if ((leftEdge && direction === -1) || (rightEdge && direction === 1)) {
            direction = width;
            //if invaders are touching either side of the wall 'direction' value is modified to 15
            //moving all invader 15 spaces, which means one entire line dawn
            //if direction is already set to 15, it'll receive the value of 1 our -1
            //--se os invaders estiverem tocando a parede o valor de 'direction' é modificado para 15
            //--movendo todos invader 15 espaços, ou seja uma linha para baixo 
            //--do contrario, se 'direction' ja for = 15, irá receber o valor de 1 ou -1
        } else if (direction === width) {
            if (leftEdge) direction = 1
            else direction = -1
        }

        for (let i = 0; i <= alienInvaders.length - 1; i++) {
            squares[alienInvaders[i]].classList.remove('invader');
            //removes 'invader' class so it can be added later on its new location 
            //--remove a classe 'invader' para ser adicionada após definida nova localização
        }

        for (let i = 0; i <= alienInvaders.length - 1; i++) {
            alienInvaders[i] += direction
            //will assing a new location to the invader either to the left or right depending on 'direction' value
            //--definirá a nova localização do invader para a esquerda ou direita dependendo do valor de 'direction'
        }
        for (let i = 0; i <= alienInvaders.length - 1; i++) {
            if (!alienInvadersTakenDown.includes(i)) {
                squares[alienInvaders[i]].classList.add('invader');
            }
            //adds 'invader' class so it shows up on it's new location
            //--adiciona a classe 'invader' na nova localização
        }

        //game over D:
        //if the invader touches the shooter the game ends
        //--se o invader encosta no shooter o jogo termina
        if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
            resultDisplay.innerHTML = 'Game Over';
            squares[currentShooterIndex].classList.add('boom');
            clearInterval(invaderId);
            //clear interval will stop all the movement
            //--clear interva irá parar todos os movimentos
        }


        //if invaders touch the last 15 squares of the grid the game also ends
        //--se os invaders tocarem nos ultimos 15 quadrados da grid o jogo termina também
        for (let i = 0; i <= alienInvaders.length - 1; i++) {
            if (alienInvaders[i] > (squares.length - (width - 1))) {
                resultDisplay.innerHTML = 'Game Over';
                clearInterval(invaderId);
            }
        }


        //decide a win
        //vitoria
        if (alienInvadersTakenDown.length === alienInvaders.length) {
            resultDisplay.innerHTML = 'You Win';
            clearInterval(invaderId);
        }
    } // end function

    invaderId = setInterval(moveInvaders, 500); //so far it works :D

    //shoot'em all 
    //hora de atirar 
    function shoot(e) {
        let laserId
        let currentLaserIndex = currentShooterIndex;
        //move the laser from the shooter to the invader in a straight line
        //mover o laser do shooter para o invader em linha reta
        function moveLaser() {
            squares[currentLaserIndex].classList.remove('laser') //remove o laser da posição atual
            currentLaserIndex -= width  //move o laser para a linha de cima ( -15 )
            squares[currentLaserIndex].classList.add('laser') // adiciona a classe novamente na nova pos.

            if (squares[currentLaserIndex].classList.contains('invader')) { //se o laser encostas no invader
                squares[currentLaserIndex].classList.remove('laser')    //remove a classe laser
                squares[currentLaserIndex].classList.remove('invader')  // remove a classe invader
                squares[currentLaserIndex].classList.add('boom')    // adiciona a classe 'boom'

                setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 200)  //remove a classe boom após 300ms
                clearTimeout(laserId)

                const alienTakenDown = alienInvaders.indexOf(currentLaserIndex);
                alienInvadersTakenDown.push(alienTakenDown);
                result++
                resultDisplay.innerHTML = result
            }
            if (currentLaserIndex < width) {
                clearInterval(laserId) //sem o clearInterval haverão varios problemas no console
                setTimeout(() => squares[currentLaserIndex].classList.remove('laser'), 100) // sem o timeout a classe laser não é removida ao chegar no topo
            }
        }

        switch (e.key) { //arrow up para ativar o laser
            case 'ArrowUp':
                laserId = setInterval(moveLaser, 100) //laser se movimenta para cima a cada 100ms
        }
    }

    document.addEventListener('keyup', shoot)


})

