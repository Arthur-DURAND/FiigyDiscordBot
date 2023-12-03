const { createCanvas, loadImage } = require('canvas')
const fs = require("fs");
const { Op } = require('sequelize')


class Chess {
    static async startSetTimout(client){
        const nextDate = await client.sequelize.models.singleton.findOne({where: {name: "TEAM_CHESS_NEXT_DATE"}})
        if(nextDate && nextDate.value){
            setTimeout(async function() { // Also do it when starting game (in case no restart)
                const currentTeam = client.sequelize.models.singleton.findOne({where: {name: "TEAM_CHESS_CURRENT_TEAM"}})
                // Starting game
                if(!currentTeam || currentTeam.value == null){
                    await client.sequelize.models.team_chess_board.truncate();
                    await client.sequelize.models.team_chess_board.create({
                        piece_type:"T",
                        colour: 0,
                        col: 1,
                        row: 1
                    })
                    await client.sequelize.models.team_chess_board.create({
                        piece_type:"C",
                        colour: 0,
                        col: 2,
                        row: 1
                    })
                    await client.sequelize.models.team_chess_board.create({
                        piece_type:"F",
                        colour: 0,
                        col: 3,
                        row: 1
                    })
                    await client.sequelize.models.team_chess_board.create({
                        piece_type:"R",
                        colour: 0,
                        col: 4,
                        row: 1
                    })
                    await client.sequelize.models.team_chess_board.create({
                        piece_type:"K",
                        colour: 0,
                        col: 5,
                        row: 1
                    })
                    await client.sequelize.models.team_chess_board.create({
                        piece_type:"F",
                        colour: 0,
                        col: 6,
                        row: 1
                    })
                    await client.sequelize.models.team_chess_board.create({
                        piece_type:"C",
                        colour: 0,
                        col: 7,
                        row: 1
                    })
                    await client.sequelize.models.team_chess_board.create({
                        piece_type:"T",
                        colour: 0,
                        col: 8,
                        row: 1
                    })
                    for(let i=1 ; i<=8 ; i++){
                        await client.sequelize.models.team_chess_board.create({
                            piece_type:"P",
                            colour: 0,
                            col: i,
                            row: 2
                        })
                    }
                    await client.sequelize.models.team_chess_board.create({
                        piece_type:"T",
                        colour: 1,
                        col: 1,
                        row: 8
                    })
                    await client.sequelize.models.team_chess_board.create({
                        piece_type:"C",
                        colour: 1,
                        col: 2,
                        row: 8
                    })
                    await client.sequelize.models.team_chess_board.create({
                        piece_type:"F",
                        colour: 1,
                        col: 3,
                        row: 8
                    })
                    await client.sequelize.models.team_chess_board.create({
                        piece_type:"R",
                        colour: 1,
                        col: 4,
                        row: 8
                    })
                    await client.sequelize.models.team_chess_board.create({
                        piece_type:"K",
                        colour: 1,
                        col: 5,
                        row: 8
                    })
                    await client.sequelize.models.team_chess_board.create({
                        piece_type:"F",
                        colour: 1,
                        col: 6,
                        row: 8
                    })
                    await client.sequelize.models.team_chess_board.create({
                        piece_type:"C",
                        colour: 1,
                        col: 7,
                        row: 8
                    })
                    await client.sequelize.models.team_chess_board.create({
                        piece_type:"T",
                        colour: 1,
                        col: 8,
                        row: 8
                    })
                    for(let i=1 ; i<=8 ; i++){
                        await client.sequelize.models.team_chess_board.create({
                            piece_type:"P",
                            colour: 1,
                            col: i,
                            row: 7
                        })
                    }
                    const chessChannelId = await client.sequelize.models.singleton.findOne({where:{name:"TEAM_CHESS_MAIN_CHANNEL_ID"}})
                    const chessChannel = client.channels.cache.get(chessChannelId.value);
                }
                // Playing
            }, Math.max(parseInt(nextDate.value)*1000 - Date.now(), 0))
        }
    }

    static async generateBoardImage(client){
        const chessPieceSize = 68
        const lineWidth = 6
        const canvas = createCanvas(chessPieceSize * 10 + lineWidth * 2, chessPieceSize * 10 + lineWidth * 2)
        const ctx = canvas.getContext('2d')
        // background colour
        ctx.fillStyle = "#FFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // line around the board
        ctx.fillStyle = "#451A31";
        ctx.fillRect(chessPieceSize, chessPieceSize, canvas.width-chessPieceSize*2, canvas.height-chessPieceSize*2);
        // fill again inside the board
        ctx.fillStyle = "#f0E7d8";
        ctx.fillRect(chessPieceSize + lineWidth, chessPieceSize + lineWidth, canvas.width - 2*chessPieceSize - 2*lineWidth, canvas.height - 2*chessPieceSize - 2*lineWidth);
        // Board itself
        ctx.fillStyle = "#56203d";
        for(let i=0 ; i<64 ; i++){
            if((i%8 + Math.floor(i/8))%2 == 0){
                console.log(i, Math.floor(i/8), i%8)
                ctx.fillRect(chessPieceSize + lineWidth + (Math.floor(i/8) * chessPieceSize), chessPieceSize + lineWidth + (i%8 * chessPieceSize), chessPieceSize, chessPieceSize);
            }
        }
        // Pieces
        const chessPieces = await client.sequelize.models.team_chess_board.findAll({where:{[Op.not]:{[Op.or]:{col:null, row:null}}}})
        for(let chessPiece of chessPieces){
            if(chessPiece){
                console.log("./Games/Images/"+chessPiece.piece_type+(chessPiece.colour ? 'B' : 'N') +".png")
                const chessPieceImage = await loadImage("./Games/Images/"+chessPiece.piece_type+(chessPiece.colour ? 'B' : 'N') +".png");
                ctx.drawImage(chessPieceImage, lineWidth + chessPiece.col * chessPieceSize, lineWidth + chessPiece.row * chessPieceSize, chessPieceSize, chessPieceSize)
            }
        }
        //ctx.fillRect(55, 55, canvas.width-110, canvas.height-110);
        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync("./image.png", buffer);
    }
}
module.exports = Chess;

