import { Text, View } from 'react-native';



interface EditScreenInfoProps {
  path: string;
}

export const EditScreenInfo: React.FC<EditScreenInfoProps> = ({ path }) => {

  const title = "mmmhmm yummyy:"
  const description = "Change any of the text, save the file, and your app will automatically update."

  return (
    <View>
      <View className='rounded-md px-1 items-center bg-red-500'>
        <Text className={styles.getStartedText}>{title}</Text>
        <View className={`${styles.codeHighlightContainer} ${styles.homeScreenFilename}`}>
          <Text>{path}</Text>
        </View>
        <Text className={styles.getStartedText}>
          {description}
        </Text>
      </View>
    </View>
  );
};

const styles = {
  codeHighlightContainer: `rounded-md px-1`,
  getStartedContainer: `items-center mx-12 text-center justify-center`,
  getStartedText: `text-lg leading-6 text-center`,
  homeScreenFilename: `my-2`,
};
