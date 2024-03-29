from django.urls import path
from .views import clubs
from .views import events
from .views import bands
from .views import crews
from .views import competitors
from .views import times


urlpatterns = [
path('clubs/', clubs.ClubListView.as_view()),
path('club-data-import/', clubs.ClubDataImport.as_view()),
path('events/', events.EventListView.as_view()),
path('event-data-import/', events.EventDataImport.as_view()),
path('band-data-import/', bands.BandDataImport.as_view()),
path('bands/', bands.BandListView.as_view()),
path('crews/', crews.CrewListView.as_view(), name='crews-list'),
path('crews/<int:pk>', crews.CrewDetailView.as_view(), name='crews-detail'),
path('', crews.CrewListView.as_view()),
path('results/', crews.CrewListView.as_view()),
path('crew-data-import/', crews.CrewDataImport.as_view()),
path('crew-data-export/', crews.CrewDataExport.as_view()),
path('competitor-data-export/', competitors.CompetitorDataExport.as_view()),
path('competitor-data-import/', competitors.CompetitorDataImport.as_view()),
path('race-times/', times.RaceTimeListView.as_view()),
path('race-times/<int:pk>', times.RaceTimeDetailView.as_view()),
path('crew-race-times/', times.CrewRaceTimesImport.as_view()),
]
