function matchResumeWithJob(resumeText, job) {

    // Temporary mock AI response
    // We will replace this with the real AI API later.

    const resume = resumeText.toLowerCase();

    const requiredSkills = job.skills || [];

    const matchingSkills = requiredSkills.filter((skill) =>
        resume.includes(skill.toLowerCase())
    );

    const missingSkills = requiredSkills.filter(
        (skill) => !resume.includes(skill.toLowerCase())
    );

    const matchScore =
        requiredSkills.length === 0
            ? 0
            : Math.round(
                (matchingSkills.length / requiredSkills.length) * 100
            );

    return {
        matchScore,
        matchingSkills,
        missingSkills,
        suggestions:
            missingSkills.length > 0
                ? `Consider improving your skills in: ${missingSkills.join(", ")}`
                : "Your skills match the job requirements well."
    };
}

module.exports = matchResumeWithJob;