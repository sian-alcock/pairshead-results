from django.urls import path
from .views import CrewListView, CrewDetailView, RaceTimeListView, RaceTimeDetailView, CrewRaceTimesImport, ClubListView, EventListView, BandDataImport, CrewDataImport, CrewDataExport, EventDataImport, ClubDataImport, CompetitorDataImport

urlpatterns = [
    path('crews/<int:pk>', CrewDetailView.as_view(), name='crews-detail'),
    path('crews/', CrewListView.as_view(), name='crews-list'),
    path('race-times/<int:pk>', RaceTimeDetailView.as_view()),
    path('race-times/', RaceTimeListView.as_view()),
    path('crew-race-times/', CrewRaceTimesImport.as_view()),
    path('results/', CrewListView.as_view()),
    path('clubs/', ClubListView.as_view()),
    path('events/', EventListView.as_view()),
    path('crew-data-import/', CrewDataImport.as_view()),
    path('crew-data-export/', CrewDataExport.as_view()),
    path('club-data-import/', ClubDataImport.as_view()),
    path('event-data-import/', EventDataImport.as_view()),
    path('band-data-import/', BandDataImport.as_view()),
    path('competitor-data-import/', CompetitorDataImport.as_view()),
    path('', CrewListView.as_view()),
]
