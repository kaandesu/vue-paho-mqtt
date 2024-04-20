/**
 * Create a list of possible topics from a topic string that may contain wildcards
 * @param topic A topic string that may contain wildcards
 */
export function createTopicList(topic: string): string[] {
  const parts = topic.split('/');
  const result: string[] = [];

  for (let i = 0; i < parts.length; i++) {
    let generatedTopic =
      parts.slice(0, i).join('/') + '/+/' + parts.slice(i + 1).join('/');
    if (generatedTopic.startsWith('/'))
      generatedTopic = generatedTopic.slice(1);
    if (generatedTopic.endsWith('/'))
      generatedTopic = generatedTopic.slice(0, -1);
    result.push(generatedTopic);
  }

  for (let i = 0; i < parts.length; i++) {
    const generatedTopic =
      parts.slice(0, i + 1).join('/') + (i < parts.length - 1 ? '/#' : '');
    result.push(generatedTopic);
  }

  return result;
}
