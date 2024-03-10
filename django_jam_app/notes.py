class keys():
    key_dict = dict()
    reverse_key_dict = dict()
    notes = [
    "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
    "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5", 
    "C6",
    "Break"
    ]

    # called once per app startup
    # prob not needed if done by JavaScript implementation
    def populate_key_dict():
        # key_dict.update({:filename})
        pass

    # def populate_reverse_key_dict():
    #     pass

    # on piano key click, calls this subroutine and feed in key
    def append_tune_string(tune_string, key):
        if tune_string.count(',') < 15:
            tune_string += ","
            tune_string += key

        return tune_string

    # also prob not needed if done by JS playback
    def read_tune_string(tune_string):
        tune_arr = tune_string.split(",")
        return tune_arr

    # only reset button, no correct/edit
    def reset_tune_string(tune_string):
        return ""
    
    # for duration call
    def bpm_to_ms(beats_per_minute):
        return 60000/beats_per_minute
    
