const FI = {
  draw: {
    toolbar: {
      actions: {
        title: 'Peruuta piirros',
        text: 'Peruuta'
      },
      finish: {
        title: 'Piirros valmis',
        text: 'Valmis'
      },
      undo: {
        title: 'Poista edellinen piste',
        text: 'Poista edellinen piste'
      },
      buttons: {
        polyline: 'Piirrä vapaa viiva',
        polygon: 'Piirrä monikulmio alue',
        rectangle: 'Piirrä neliö',
        circle: 'Piirrä ympyrä',
        marker: 'Piirrä merkki',
        circlemarker: 'Piirrä ympyrämerkki'
      }
    },
    handlers: {
      circle: {
        tooltip: {
          start: 'Klikkaa ja raahaa piirtääksesi ympyrä.'
        },
        radius: 'Radius'
      },
      circlemarker: {
        tooltip: {
          start: 'Klikkaa karttaa ja aseta ympyrämerkki.'
        }
      },
      marker: {
        tooltip: {
          start: 'Klikkaa karttaa asettaaksesi merkki.'
        }
      },
      polygon: {
        tooltip: {
          start: 'Klikkaa ja aloita muodon piirtäminen.',
          cont: 'Klikkaa jatkaaksesi piirtämistä.',
          end: 'Klikkaa ensimmäistä pistettä lopettaaksesi piirtäminen.'
        }
      },
      polyline: {
        error: '<strong>Virhe:</strong> muodon reunat eivät saa mennä ristiin!',
        tooltip: {
          start: 'Klikkaa aloittaaksesi viivan piirtäminen.',
          cont: 'Klikkaa jatkaaksesi viivan piirtämistä.',
          end: 'Klikkaa viimeistä pistettä päättääksesi piirtäminen.'
        }
      },
      rectangle: {
        tooltip: {
          start: 'Klikkaa ja raahaa piirtääksesi neliö.'
        }
      },
      simpleshape: {
        tooltip: {
          end: 'Vapauta painike lopettaaksesi piirtäminen.'
        }
      }
    }
  },
  edit: {
    toolbar: {
      actions: {
        save: {
          title: 'Tallenna muutokset',
          text: 'Tallenna'
        },
        cancel: {
          title: 'Peruuta muokkaaminen, hylkää muutokset',
          text: 'Peruuta'
        },
        clearAll: {
          title: 'Tyhjennä kartta',
          text: 'Tyhjennä kaikki'
        }
      },
      buttons: {
        edit: 'Muokkaa piirrosta',
        editDisabled: 'Ei muokattavaa',
        remove: 'Poista piirros',
        removeDisabled: 'Ei poistettavaa'
      }
    },
    handlers: {
      edit: {
        tooltip: {
          text: 'Raahaa muokataksesi.',
          subtext: 'Klikkaa peruuta peruuttaaksesi'
        }
      },
      remove: {
        tooltip: {
          text: 'Klikkaa poistettavaa piirrosta'
        }
      }
    }
  }
};

const EN = {
  draw: {
    toolbar: {
      actions: {
        title: 'Cancel drawing',
        text: 'Cancel'
      },
      finish: {
        title: 'Finish drawing',
        text: 'Finish'
      },
      undo: {
        title: 'Delete last point drawn',
        text: 'Delete last point'
      },
      buttons: {
        polyline: 'Draw a polyline',
        polygon: 'Draw a polygon',
        rectangle: 'Draw a rectangle',
        circle: 'Draw a circle',
        marker: 'Draw a marker',
        circlemarker: 'Draw a circlemarker'
      }
    },
    handlers: {
      circle: {
        tooltip: {
          start: 'Click and drag to draw circle.'
        },
        radius: 'Radius'
      },
      circlemarker: {
        tooltip: {
          start: 'Click map to place circle marker.'
        }
      },
      marker: {
        tooltip: {
          start: 'Click map to place marker.'
        }
      },
      polygon: {
        tooltip: {
          start: 'Click to start drawing shape.',
          cont: 'Click to continue drawing shape.',
          end: 'Click first point to close this shape.'
        }
      },
      polyline: {
        error: '<strong>Error:</strong> shape edges cannot cross!',
        tooltip: {
          start: 'Click to start drawing line.',
          cont: 'Click to continue drawing line.',
          end: 'Click last point to finish line.'
        }
      },
      rectangle: {
        tooltip: {
          start: 'Click and drag to draw rectangle.'
        }
      },
      simpleshape: {
        tooltip: {
          end: 'Release mouse to finish drawing.'
        }
      }
    }
  },
  edit: {
    toolbar: {
      actions: {
        save: {
          title: 'Save changes',
          text: 'Save'
        },
        cancel: {
          title: 'Cancel editing, discards all changes',
          text: 'Cancel'
        },
        clearAll: {
          title: 'Clear all layers',
          text: 'Clear All'
        }
      },
      buttons: {
        edit: 'Edit layers',
        editDisabled: 'No layers to edit',
        remove: 'Delete layers',
        removeDisabled: 'No layers to delete'
      }
    },
    handlers: {
      edit: {
        tooltip: {
          text: 'Drag handles or markers to edit features.',
          subtext: 'Click cancel to undo changes.'
        }
      },
      remove: {
        tooltip: {
          text: 'Click on a feature to remove.'
        }
      }
    }
  }
};

const SV = {
  draw: {
    toolbar: {
      actions: {
        title: 'Avbryt ritning',
        text: 'Avbryt'
      },
      finish: {
        title: 'Avsluta ritning',
        text: 'Avsluta'
      },
      undo: {
        title: 'Radera sista punkten ritad',
        text: 'Radera sista punkten'
      },
      buttons: {
        polyline: 'Rita en bana',
        polygon: 'Rita en polygon',
        rectangle: 'Rita en rektangel',
        circle: 'Rita en cirkel',
        marker: 'Placera en markör',
        circlemarker: 'Placera en cirkelmarkör'
      }
    },
    handlers: {
      circle: {
        tooltip: {
          start: 'Klicka och dra för att rita en cirkel'
        },
        radius: 'Radie'
      },
      circlemarker: {
        tooltip: {
          start: 'Klicka på kartan för att placera cirkelmarkören'
        }
      },
      marker: {
        tooltip: {
          start: 'Klicka på kartan för att placera markören'
        }
      },
      polygon: {
        tooltip: {
          start: 'Klicka för att börja rita en form.',
          cont: 'Klicka för att fortsätta rita formen.',
          end: 'Klicka första punkten för att stänga formen.'
        }
      },
      polyline: {
        error: '<strong>Error:</strong> formen kan inte korsas!',
        tooltip: {
          start: 'Klicka för att börja rita banan.',
          cont: 'Klicka för att fortsätta rita banan.',
          end: 'Klicka på sista punkten för att sluta banan.'
        }
      },
      rectangle: {
        tooltip: {
          start: 'Klicka och dra för att rita en rektangel'
        }
      },
      simpleshape: {
        tooltip: {
          end: 'Släpp musnappen för att slutföra'
        }
      }
    }
  },
  edit: {
    toolbar: {
      actions: {
        save: {
          title: 'Spara ändringar',
          text: 'Spara'
        },
        cancel: {
          title: 'Avbryt redigering, ignorera ändringar',
          text: 'Avbryt'
        },
        clearAll: {
          title: 'Radera alla lagrar',
          text: 'Radera allt'
        }
      },
      buttons: {
        edit: 'Redigera lagrar',
        editDisabled: 'Inga lagrar att redigera',
        remove: 'Radera lagrar',
        removeDisabled: 'Inga lagrar att radera'
      }
    },
    handlers: {
      edit: {
        tooltip: {
          text: 'Dra handtag eller markörer för att redigera funktioner.',
          subtext: 'Klicka Avbryt för att ångra ändringar'
        }
      },
      remove: {
        tooltip: {
          text: 'Klicka på en funktion för att radera'
        }
      }
    }
  }
};


export default (lang) => {
  switch (lang) {
    case 'fi': return FI;

    case 'en': return EN;

    case 'sv': return SV;

    default: return FI;
  }
};
