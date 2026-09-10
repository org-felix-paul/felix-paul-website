from tictactoe import TicTacToe, random_player, input_player, test_durchlauf
from copy import deepcopy

def check_win(feld, symbol):
    pass


def ki_player(feld, symbol):
    pass
    #return x,y

def ki_player2(feld, symbol):
    pass
    #return x,y


# Eure KI vs Random Spieler
# spiel = TicTacToe(x=ki_player, o=random_player)

# Eure KI gegen euch
# spiel = TicTacToe(x=ki_player, o=input_player)

# Teste deine KI "n" mal gegen einen Random Spieler
# test_durchlauf(x=ki_player, o=random_player,n=100)

# KI 1 vs. KI 2
# spiel =  TicTacToe(x=ki_player, o=ki_player2)

# Du spielst gegen einen Random Spieler
spiel = TicTacToe(x=input_player, o=random_player)
spiel.start()
