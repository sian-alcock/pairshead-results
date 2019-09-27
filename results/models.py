from django.db import models

class Club(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=50)
    abbreviation = models.CharField(max_length=50, blank=True, null=True)
    index_code = models.CharField(max_length=20, blank=True, null=True)
    colours = models.CharField(max_length=100, blank=True, null=True)
    blade_image = models.CharField(max_length=200, blank=True, null=True)

class Event(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=30)
    override_name = models.CharField(max_length=30, blank=True, null=True)
    info = models.CharField(max_length=30, blank=True, null=True)
    type = models.CharField(max_length=30, blank=True, null=True)
    gender = models.CharField(max_length=20, blank=True, null=True)

class Band(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=30)
    event = models.ForeignKey(Event, related_name='bands',
    on_delete=models.CASCADE)

class Crew(models.Model):
    name = models.CharField(max_length=50)
    id = models.IntegerField(primary_key=True)
    composite_code = models.CharField(max_length=10, blank=True, null=True)
    club = models.ForeignKey(Club, related_name='crews',
    on_delete=models.CASCADE)
    rowing_CRI = models.IntegerField(blank=True, null=True)
    rowing_CRI_max = models.IntegerField(blank=True, null=True)
    sculling_CRI = models.IntegerField(blank=True, null=True)
    sculling_CRI_max = models.IntegerField(blank=True, null=True)
    event = models.ForeignKey(Event, related_name='crews',
    on_delete=models.CASCADE)
    status = models.CharField(max_length=20)
    penalty = models.IntegerField(default=0)
    handicap = models.IntegerField(default=0)
    # manual_override_minutes = models.IntegerField(default=0)
    # manual_override_seconds = models.IntegerField(default=0)
    # manual_override_hundredths_seconds = models.IntegerField(default=0)
    bib_number = models.IntegerField(blank=True, null=True)
    band = models.ForeignKey(Band, related_name='bands',
    on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.name

    @property
    def competitor_names(self):
        if not self.competitors:
            return 0

        competitor_list = list(map(lambda competitor: competitor.last_name, self.competitors.all()))
        value = ' / '.join(competitor_list)
        return value

    @property
    def raw_time(self):
        if len(self.times.filter(tap='Start')) > 1 or len(self.times.filter(tap='Finish')) > 1:
            return 0

        start = self.times.get(tap='Start').time_tap
        end = self.times.get(tap='Finish').time_tap
        return end - start

    @property
    def race_time(self):
        # The race time can include the penalty as by default it is 0
        return self.raw_time + self.penalty*1000

    @property
    def start_time(self):
        if len(self.times.filter(tap='Start')) > 1:
            return 0

        start = self.times.get(tap='Start').time_tap
        return start

    @property
    def finish_time(self):
        if len(self.times.filter(tap='Finish')) > 1:
            return 0
        finish = self.times.get(tap='Finish').time_tap
        return finish

    @property
    def start_sequence(self):
        if len(self.times.filter(tap='Start')) > 1:
            return 0
        sequence = self.times.get(tap='Start').sequence
        return sequence

    @property
    def finish_sequence(self):
        if len(self.times.filter(tap='Finish')) > 1:
            return 0
        sequence = self.times.get(tap='Finish').sequence
        return sequence

# Turn the three manual override fields into miliseconds
    # @property
    # def manual_override_time(self):
    #     time = (self.manual_override_minutes*60*1000) + (self.manual_override_seconds*1000) + (self.manual_override_hundredths_seconds*10)
    #     return time

class Competitor(models.Model):
    last_name = models.CharField(max_length=50)
    gender = models.CharField(max_length=10)
    substitution = models.BooleanField(blank=True, null=True,)
    crew = models.ForeignKey(Crew, related_name='competitors',
    on_delete=models.SET_NULL, blank=True, null=True,)

class RaceTime(models.Model):
    sequence = models.IntegerField()
    bib_number = models.IntegerField(blank=True, null=True,)
    tap = models.CharField(max_length=10)
    time_tap = models.BigIntegerField()
    crew = models.ForeignKey(Crew, related_name='times',
    on_delete=models.SET_NULL, blank=True, null=True,)
