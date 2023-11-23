// Generating complete board with https://www.geeksforgeeks.org/program-sudoku-generator/
class Sudoku {
 
    // Constructor
    constructor() {
        this.N = 9;

        // Compute square root of N
        this.SRN = 3;
 
        // Initialize all entries as false to indicate
        // that there are no edges initially
        this.mat = Array.from({
            length: this.N
        }, () => Array.from({
            length: this.N
        }, () => 0));
    }
 
    // Sudoku Generator
    fillValues() {
        // Fill the diagonal of SRN x SRN matrices
        this.fillDiagonal();
 
        // Fill remaining blocks
        this.fillRemaining(0, this.SRN);
    }
 
    // Fill the diagonal SRN number of SRN x SRN matrices
    fillDiagonal() {
        for (let i = 0; i < this.N; i += this.SRN) {
            // for diagonal box, start coordinates->i==j
            this.fillBox(i, i);
        }
    }
 
    // Returns false if given 3 x 3 block contains num.
    unUsedInBox(rowStart, colStart, num) {
        for (let i = 0; i < this.SRN; i++) {
            for (let j = 0; j < this.SRN; j++) {
                if (this.mat[rowStart + i][colStart + j] === num) {
                    return false;
                }
            }
        }
        return true;
    }
 
    // Fill a 3 x 3 matrix.
    fillBox(row, col) {
        let num = 0;
        for (let i = 0; i < this.SRN; i++) {
            for (let j = 0; j < this.SRN; j++) {
                while (true) {
                    num = this.randomGenerator(this.N);
                    if (this.unUsedInBox(row, col, num)) {
                        break;
                    }
                }
                this.mat[row + i][col + j] = num;
            }
        }
    }
 
    // Random generator
    randomGenerator(num) {
        return Math.floor(Math.random() * num + 1);
    }
 
    // Check if safe to put in cell
    checkIfSafe(i, j, num) {
        return (
            this.unUsedInRow(i, num) &&
            this.unUsedInCol(j, num) &&
            this.unUsedInBox(i - (i % this.SRN), j - (j % this.SRN), num)
        );
    }
 
    // check in the row for existence
    unUsedInRow(i, num) {
        for (let j = 0; j < this.N; j++) {
            if (this.mat[i][j] === num) {
                return false;
            }
        }
        return true;
    }
 
    // check in the row for existence
    unUsedInCol(j, num) {
        for (let i = 0; i < this.N; i++) {
            if (this.mat[i][j] === num) {
                return false;
            }
        }
        return true;
    }
 
    // A recursive function to fill remaining
    // matrix
    fillRemaining(i, j) {
        // Check if we have reached the end of the matrix
        if (i === this.N - 1 && j === this.N) {
            return true;
        }
 
        // Move to the next row if we have reached the end of the current row
        if (j === this.N) {
            i += 1;
            j = 0;
        }
 
 
        // Skip cells that are already filled
        if (this.mat[i][j] !== 0) {
            return this.fillRemaining(i, j + 1);
        }
 
        // Try filling the current cell with a valid value
        for (let num = 1; num <= this.N; num++) {
            if (this.checkIfSafe(i, j, num)) {
                this.mat[i][j] = num;
                if (this.fillRemaining(i, j + 1)) {
                    return true;
                }
                this.mat[i][j] = 0;
            }
        }
 
        // No valid value was found, so backtrack
        return false;
    }
 
    // Print sudoku
    toString() {
        let str = ""
        for (let i = 0; i < this.N; i++) {
            if(i!=0 && i%3 == 0){
                str += '-'.repeat(this.N+this.N/3-1) + "\n"
            }
            for (let j = 0; j < this.N; j++) {
                if(j!=0 && j%3 == 0){
                    str += '|'
                }
                str += this.mat[i][j] != 0 ? this.mat[i][j] : ' '
            }
            str +=  "\n" 
        }
        return str
    }

    toArgs() {
        let str = ""
        for (let i = 0; i < this.N; i++) {
            str += this.mat[i].join("").replace(/0/g, '*')
        }
        return str
    }

    removeKDigits(K, maxDelta, difficulty) { // utiliser difficulty poru savoir quelles techniques utiliser pour essayer de replacer le chiffre
        let delta = this.randomGenerator(maxDelta)
        K += delta - Math.ceil(maxDelta/2.)
        let count = K
        let tries = 10 * K
        while(count > 0 && tries > 0){
            let row = this.randomGenerator(this.N) - 1;
            let column = this.randomGenerator(this.N) - 1;
            if (this.mat[row][column] !== 0){
                let oldValue = this.mat[row][column]
                this.mat[row][column] = 0;
                
                if(this.isForcedBySudoku(row, column)) {
                    console.log("isForcedBySudoku")
                    count--;
                } else if(difficulty > 1 && this.isOnlySpotBySudoku(row, column)) {
                    console.log("-- isOnlySpotBySudoku")
                    count--;
                } else {
                    console.log("---- unable")
                    this.mat[row][column] = oldValue;
                }
                tries--
            }
        }
        this.idk()
    }

    isForcedBySudoku(row, column){
        // Un seul chiffre peut se retrouver ici (sudoku rules)
        let count = 0        
        for(let i=1 ; i<=9 ; i++){
            if(this.checkIfSafe(row, column, i)){
                count++
            }
        }
        return count == 1
    }

    isOnlySpotBySudoku(row, column){
        // Un des chiffres ne peut pas être placé autre part dans la box / column / row
        for(let i=1 ; i<=9 ; i++){
            let exit = false
            if(this.checkIfSafe(row, column, i)){
                let countBox = 0
                let countRow = 0
                let countColumn = 0
                for(let x=0 ; x<3 ; x++){
                    for(let y=0 ; y<3 ; y++){
                        if(this.checkIfSafe(Math.floor(row/3)*3+x,Math.floor(column/3)*3+y,i)){
                            countBox++
                        }
                        if(this.checkIfSafe(3*x+y,column,i)){
                            countRow++
                        }
                        if(this.checkIfSafe(row,3*x+y,i)){
                            countColumn++
                        }
                        if(countBox>1 && countColumn>1 && countRow>1){
                            exit = true
                            break
                        }
                    }
                    if(exit){
                        break
                    }
                }
                if(countBox == 1 || countRow == 1 || countColumn == 1){
                    return true
                }
            }
        }
        return false
    }

    idk(){
        let possibleValues = Array.from({
            length: this.N
        }, () => Array.from({
            length: this.N
        }, () => Array.from({
            length: this.N
        }, (_, i) => i + 1)))

        console.log(possibleValues)

        // Remove by sudoku
        for(let x=0 ; x<this.N ; x++){
            for(let y=0 ; y<this.N ; y++){
                if(this.mat[x][y] != 0){
                    let value = this.mat[x][y]
                    for(let i=0 ; i<3 ; i++){
                        for(let j=0 ; j<3 ; j++){
                            possibleValues[3*i+j][y] = this.removeItemOnce(possibleValues[3*i+j][y],value)
                            possibleValues[x][3*i+j] = this.removeItemOnce(possibleValues[x][3*i+j],value)
                            possibleValues[Math.floor(x/3)*3+i][Math.floor(y/3)*3+j] = this.removeItemOnce(possibleValues[Math.floor(x/3)*3+i][Math.floor(y/3)*3+j],value)
                        }
                    }
                }
            }
        }

        // Faire des if un seul digit sur notre case, return true (entre chaque étape)
        // Upgrade : ajouter les numéros qu'on peut ajouter et recommmencer à la première étape (trop long ? résoud tout)

        // Hidden pair
        for(let i=1 ; i<=9 ; i++){
            for(let j=1 ; j<=9 ; j++){
                if(i == j){
                    continue
                }

                for(let x=0 ; x<this.N ; x++){
                    let nbCellRow = 0
                    let nbCellCol = 0
                    for(let y=0 ; y<this.N ; y++){
                        // Row
                        if(possibleValues[x][y].includes(i) && possibleValues[x][y].includes(j)){
                            nbCellRow++
                        }
                        // Col
                        if(possibleValues[y][x].includes(i) && possibleValues[y][x].includes(j)){
                            nbCellCol++
                        }
                        //Box
                        // TODO
                    }
                    if(nbCellRow <= 2){
                        // TODO
                    }
                    if(nbCellCol <= 2){

                    }
                }

            }
        }

        // Detect hidden pair & triplet (& quadruplet etc?)
        // Loop through
        // If on line, x cells have exactly x figures possibles, remove thos x figures from any other cells of the line
        // Same for squares


        // pair / triplet pointant https://sudoku.com/fr/regles-du-sudoku/triplets-pointants/


        // X-wing https://sudoku.com/fr/regles-du-sudoku/h-wing/


        // Y-wing https://sudoku.com/fr/regles-du-sudoku/y-wing/
        

        console.log(possibleValues)
    }

    idk2(){ // Remove a lot of numbers (20+ ? Then 5 by 5, then 1 by 1...)
        let possibleValues = Array.from({
            length: this.N
        }, () => Array.from({
            length: this.N
        }, () => Array.from({
            length: this.N
        }, (_, i) => i + 1)))

        let tempMat = structuredClone(this.mat)

        while(true){

            // Add values to cell
            for(let x=0 ; x<this.N ; x++){
                for(let y=0 ; y<this.N ; y++){
                    if(possibleValues[x][y].length == 1){
                        tempMat[x][y] = possibleValues[x][y][0]
                        possibleValues[x][y] = []
                    }
                }
            }     
            // No need to run harder solver, back to begining
            if(this.removeBySudoku(possibleValues, tempMat)){
                continue
            }

            if(this.nakedPairs(possibleValues)){
                continue
            }

            if(this.hiddenPairs(possibleValues)){
                continue
            }

            // Other solvers here TODO

            break;

        }
    }

    removeBySudoku(possibleValues, tempMat) {
        let continueSolving = false
        // For each cell
        for(let x=0 ; x<this.N ; x++){
            for(let y=0 ; y<this.N ; y++){
                // If it has a number
                if(tempMat[x][y] != 0){
                    let value = tempMat[x][y]
                    // remove it from row / col / box
                    for(let i=0 ; i<3 ; i++){
                        for(let j=0 ; j<3 ; j++){
                            if(possibleValues[3*i+j][y].includes(value)){
                                possibleValues[3*i+j][y] = this.removeItemOnce(possibleValues[3*i+j][y],value)
                                continueSolving = true
                            }
                            if(possibleValues[x][3*i+j].includes(value)){
                                possibleValues[x][3*i+j] = this.removeItemOnce(possibleValues[x][3*i+j],value)
                                continueSolving = true
                            }
                            if(possibleValues[Math.floor(x/3)*3+i][Math.floor(y/3)*3+j].includes(value)){
                                possibleValues[Math.floor(x/3)*3+i][Math.floor(y/3)*3+j] = this.removeItemOnce(possibleValues[Math.floor(x/3)*3+i][Math.floor(y/3)*3+j],value)
                                continueSolving = true
                            }
                        }
                    }
                }
            }
        }
        return continueSolving
    }

    nakedPairs(possibleValues){
        let continueSolving = false
        for(let x=0 ; x<this.N ; x++){
            let nbCellRow = 0
            let yRow = []
            let nbCellCol = 0
            let yCol = []
            for(let y=0 ; y<this.N ; y++){
                let pairsRow = {}
                let pairsCol = {}
                // Row
                if(possibleValues[x][y].length == 2){
                    let pair
                    if(possibleValues[x][y][0] < possibleValues[x][y][1]){
                        pair = [possibleValues[x][y][0], possibleValues[x][y][1]]
                    } else {
                        pair = [possibleValues[x][y][1], possibleValues[x][y][0]]
                    }
                    if(pairsRow[pair[0]]){
                        if(pairsRow[pair[0]][pair[1]]){
                            pairsRow[pair[0]][pair[1]] += 1
                        } else {
                            pairsRow[pair[0]][pair[1]] = 1
                        }
                    } else {
                        pairsRow[pair[0]] = {}
                        pairsRow[pair[0]][pair[1]] = 1
                    }
                }
                // Col
                if(possibleValues[y][x].length == 2){
                    let pair
                    if(possibleValues[y][x][0] < possibleValues[y][x][1]){
                        pair = [possibleValues[y][x][0], possibleValues[y][x][1]]
                    } else {
                        pair = [possibleValues[y][x][1], possibleValues[y][x][0]]
                    }
                    if(pairsRow[pair[0]]){
                        if(pairsRow[pair[0]][pair[1]]){
                            pairsRow[pair[0]][pair[1]] += 1
                        } else {
                            pairsRow[pair[0]][pair[1]] = 1
                        }
                    } else {
                        pairsRow[pair[0]] = {}
                        pairsRow[pair[0]][pair[1]] = 1
                    }
                }
                //Box
                // TODO
            }
            if(nbCellRow <= 2){
                for(const y in yRow){
                    possibleValues[y][x] = [i,j]
                }
                continueSolving = true
            }
            if(nbCellCol <= 2){
                for(const y in yCol){
                    possibleValues[y][x] = [i,j]
                }
                continueSolving = true
            }
        }
        return continueSolving
    }

    // nakedCandidates(possibleValues){
    //     // let values = ligne / col / box
    //     let values = [[1,2],[2,3],[1,2,3],[4,6],[4,5,6],[4,1]]
    //     const allNakedCandidates = nakedCandidates(0, values, [], [1,2,3,4,5,6,7,8,9], [])
    //     // Pour chaque result, enlever les extras
    // }

    // // pour chaque i appartenant à 1;9 et pas dans indexes, on ajoutes les valeurs à values (set). Si nbCandidates >= 2 && nbCandidates > nb values alors on a une solution
    // findAllNakedCandidates(nbCandidates, values, usedValues, indexes, results){
    //     for(const i of indexes){
    //         nakedCandidates(nbCandidates + 1, values, indexes, results)
    //     }
    // }

    invertIndexArray(indexes){
        return [1,2,3,4,5,6,7,8,9].filter(n => !indexes.includes(n))
    }

    hiddenPairs(possibleValues) {
        let continueSolving = false
        for(let i=1 ; i<=9 ; i++){
            for(let j=1 ; j<=9 ; j++){
                if(i == j){
                    continue
                }

                for(let x=0 ; x<this.N ; x++){
                    let nbCellRow = 0
                    let yRow = []
                    let nbCellCol = 0
                    let yCol = []
                    for(let y=0 ; y<this.N ; y++){
                        // Row
                        if(possibleValues[x][y].includes(i) || possibleValues[x][y].includes(j)){
                            nbCellRow++
                            yRow.push(y)
                        }
                        // Col
                        if(possibleValues[y][x].includes(i) || possibleValues[y][x].includes(j)){
                            nbCellCol++
                            yCol.push(y)
                        }
                        //Box
                        // TODO
                    }
                    if(nbCellRow <= 2){
                        for(const y in yRow){
                            possibleValues[y][x] = [i,j]
                        }
                        continueSolving = true
                    }
                    if(nbCellCol <= 2){
                        for(const y in yCol){
                            possibleValues[y][x] = [i,j]
                        }
                        continueSolving = true
                    }
                }

            }
        }
        return continueSolving
    }

    removeItemOnce(arr, value) { // https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array-in-javascript
        var index = arr.indexOf(value);
        if (index > -1) {
          arr.splice(index, 1);
        }
        return arr;
    }
}
module.exports = Sudoku;

