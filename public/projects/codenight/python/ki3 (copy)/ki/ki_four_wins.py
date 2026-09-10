from four_wins import FourWins, random_player, input_player, test_durchlauf
from copy import deepcopy

# Funktion um zu checken ob ein Spieler gewonnen hat
def check_win(feld, symbol):
    # Zeilen
    for x in range(6):
        for i in range(4):
            if feld[x][i] == symbol and feld[x][i + 1] == symbol and feld[x][i + 2] == symbol and \
                    feld[x][i + 3] == symbol:
                return True
    # Spalten
    for y in range(7):
        for i in range(3):
            if feld[i][y] == symbol and feld[i + 1][y] == symbol and feld[i + 2][y] == symbol and \
                    feld[i + 3][y] == symbol:
                return True
    # Diagonalen 1
    for x in range(3):
        for y in range(4):
            if feld[0 + x][0 + y] == symbol and feld[1 + x][1 + y] == symbol and feld[2 + x][2 + y] == symbol and feld[3 + x][3 + y] == symbol:
                return True

    # Diagonalen 2
    for x in range(3):
        for y in range(4):
            if feld[0 + x][3 + y] == symbol and feld[1 + x][2 + y] == symbol and feld[2 + x][1 + y] == symbol and feld[3 + x][0 + y] == symbol:
                return True

    return False

# Funktion um zu checken ob das Spielfeld voll ist
def check_draw(feld):
    for x in range(6):
        for y in range(7):
            if feld[x][y] == "_":
                return False
    return True

def ki_player(feld, symbol):
    pass
    # return c

# Hier kannst du den Code eines Freundes einsetzen, um die KI's gegeneinander spielen zu lassen
def ki_player2(feld,symbol):
    pass
    #return c

# Eure KI vs Random Spieler
# spiel = FourWins(x=ki_player, o=random_player)

# Eure KI gegen euch
# spiel = FourWins(x=ki_player, o=input_player)

# Teste deine KI "n" mal gegen einen Random Spieler
# test_durchlauf(x=ki_player, o=random_player,n=100)

# KI 1 vs KI 2
# spiel = FourWins(x=ki_player, o=ki_player2)

# Du spielst gegen einen Random Spieler
spiel = FourWins(x=input_player, o=random_player)
spiel.start()
