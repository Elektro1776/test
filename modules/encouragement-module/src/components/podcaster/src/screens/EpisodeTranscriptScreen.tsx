import { TranscriptRow } from 'podverse-shared';
import { StyleSheet } from 'react-native';
import React from 'reactn';
import { ActivityIndicator, MediaPlayerCarouselTranscripts, View } from '../components';
import { errorLogger } from '../lib/logger';
import { translate } from '../lib/i18n';
import { getEpisodeProxyTranscript, getParsedTranscript } from '../lib/transcriptHelpers';
import { trackPageView } from '../services/tracking';

const _fileName = 'src/screens/EpisodeTranscriptScreen.tsx';

type Props = {
  navigation: any;
};

type State = {
  isLoading: boolean;
  parsedTranscript: TranscriptRow[];
};

const testIDPrefix = 'episode_transcript_screen';

export class EpisodeTranscriptScreen extends React.Component<Props, State> {
  shouldLoad: boolean;

  constructor() {
    super();

    this.state = {
      isLoading: true,
      parsedTranscript: [],
    };
  }

  static navigationOptions = () => ({
    title: translate('Transcript'),
  });

  async componentDidMount() {
    const episode = this.props.route.params.episode || {};
    let parsedTranscript = [] as TranscriptRow[];

    if (episode?.transcript?.[0]?.url && episode?.transcript?.[0]?.type) {
      try {
        if (episode?.id) {
          parsedTranscript = await getEpisodeProxyTranscript(episode.id);
        } else {
          parsedTranscript = await getParsedTranscript(episode.transcript[0].url);
        }
      } catch (error) {
        errorLogger(_fileName, 'componentDidMount', error);
      }
    }
    this.setState({ isLoading: false, parsedTranscript });
    trackPageView('/episode/transcript', 'EpisodeTranscript Screen');
  }

  render() {
    const episode = this.props.route.params.episode || {};
    const { isLoading, parsedTranscript } = this.state;
    const { nowPlayingItem } = this.global.player;
    const isNowPlaying = nowPlayingItem?.episodeId === episode.id;

    return (
      <View style={styles.view}>
        {isLoading && <ActivityIndicator testID={testIDPrefix} />}
        {!isLoading && (
          <MediaPlayerCarouselTranscripts isNowPlaying={isNowPlaying} parsedTranscript={parsedTranscript} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
});
